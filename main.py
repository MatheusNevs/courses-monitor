import smtplib
from email.mime.text import MIMEText
import time
from typing import List, Dict
from dataclasses import dataclass
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from dotenv import load_dotenv
import requests


@dataclass
class Course:
    name: str
    class_number: str
    professor: str
    schedule: str
    available_seats: int
    location: str


class UnbCourseMonitor:
    def __init__(self, email_sender: "EmailSender"):
        self.email_sender = email_sender
        options = webdriver.ChromeOptions()
        options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        self.driver = webdriver.Chrome(
            service=Service(ChromeDriverManager().install()), options=options
        )

    def close_cookie_popup(self) -> None:
        try:
            cookie_button = self.driver.find_element(
                By.ID, "sigaa-cookie-consent-close"
            )
            cookie_button.click()
            time.sleep(1)
        except NoSuchElementException:
            return

    def select_department(self, department: str) -> None:
        select = Select(self.driver.find_element(By.NAME, "formTurma:inputDepto"))
        select.select_by_visible_text(department)

        search_button = self.driver.find_element(
            By.NAME, "formTurma:j_id_jsp_1370969402_11"
        )
        self.driver.execute_script("arguments[0].click();", search_button)

    def get_available_courses(self, courses_dict: Dict[str, str]) -> List[Course]:
        available_courses = []
        current_course = None

        elements = self.driver.find_elements(
            By.XPATH,
            "//*[contains(@class, 'agrupador') or "
            "contains(@class, 'linhaPar') or contains(@class, 'linhaImpar')]",
        )

        for element in elements:
            class_name = element.get_attribute("class")
            if "agrupador" in class_name:
                current_course = element.text.strip()
                continue

            if not current_course or not any(
                key in current_course for key in courses_dict
            ):
                continue

            if "linha" not in class_name:
                continue

            columns = element.find_elements(By.TAG_NAME, "td")
            class_number = columns[0].text.strip()

            if class_number != courses_dict[current_course]:
                continue

            total_seats = int(columns[5].text.strip())
            occupied_seats = int(columns[6].text.strip())
            available_seats = total_seats - occupied_seats

            if available_seats > 0:
                course = Course(
                    name=current_course,
                    class_number=class_number,
                    professor=columns[2].text.strip(),
                    schedule=columns[3].text.strip(),
                    available_seats=available_seats,
                    location=columns[7].text.strip(),
                )
                available_courses.append(course)

        return available_courses

    def check_seats(
        self, department: str, courses: Dict[str, str], user_email: str
    ) -> None:
        try:
            self.driver.get("https://sigaa.unb.br/sigaa/public/turmas/listar.jsf")

            self.close_cookie_popup()
            self.select_department(department)

            WebDriverWait(self.driver, 15).until(
                EC.presence_of_element_located(
                    (By.XPATH, "//table[@class='listagem']/tbody/tr")
                )
            )

            available_courses = self.get_available_courses(courses)

            if available_courses:
                messages = [
                    self._format_course_message(course) for course in available_courses
                ]
                self.email_sender.send_email(
                    user_email, messages, "Availabe Seats in Courses"
                )
                print("Email sent with available seats!")
            else:
                print("No available seats found in monitored courses.")

        finally:
            if self.driver:
                self.driver.quit()

    @staticmethod
    def _format_course_message(course: Course) -> str:
        return (
            f"Course: {course.name}\n"
            f"Class: {course.class_number}\n"
            f"Professor: {course.professor}\n"
            f"Schedule: {course.schedule}\n"
            f"Available seats: {course.available_seats}\n"
            f"Location: {course.location}\n"
        )


class EmailSender:
    def __init__(self, email: str, password: str):
        self.email = email
        self.password = password

    def send_email(
        self,
        to_email: str,
        messages: List[str],
        subject: str,
    ) -> None:
        msg = MIMEText("\n".join(messages))
        msg["Subject"] = subject
        msg["From"] = self.email
        msg["To"] = to_email

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(self.email, self.password)
            server.sendmail(self.email, to_email, msg.as_string())


def main():
    load_dotenv()

    email = os.getenv("EMAIL_SENDER")
    password = os.getenv("EMAIL_PASSWORD")

    if not email or not password:
        raise ValueError("Email and password environment variables must be set")

    email_sender = EmailSender(email, password)
    monitor = UnbCourseMonitor(email_sender)

    admin_token = os.getenv("ADMIN_TOKEN")
    if not admin_token:
        raise ValueError("Admin token environment variable must be set")

    while True:
        response = requests.get(
            "http://localhost:3000/api/desiredClass",
            cookies={"authjs.session-token": admin_token},
            timeout=30,
        )

        if response.status_code != 200:
            print(f"Error fetching data: {response.status_code}")
            time.sleep(300)
            continue

        users_data = response.json()

        for user in users_data:
            email = user["email"]
            for department in user["departments"]:
                dept_name = department["name"]
                courses = {}

                for subject in department["subjects"]:
                    subject_name = subject["name"]
                    for class_info in subject["classes"]:
                        courses[subject_name] = class_info["number"]

                if courses:
                    monitor.check_seats(dept_name, courses, email)

        time.sleep(300)


if __name__ == "__main__":
    main()
