from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import smtplib
from email.mime.text import MIMEText
import time
from typing import List, Dict, Optional
from dataclasses import dataclass

@dataclass
class Course:
  name: str
  class_number: str
  professor: str
  schedule: str
  available_seats: int
  location: str

class UnbCourseMonitor:
  COURSES = {
    "CIC0099 - ORGANIZAÇÃO E ARQUITETURA DE COMPUTADORES": "03",
    "CIC0101 - SISTEMAS DE INFORMACAO": "01",
    "CIC0087 - TOPICOS AVANCADOS EM COMPUTADORES": "03"
  }
  
  def __init__(self):
    self.driver = None
    self.email_sender = EmailSender("your_email", "your_password")

  def setup_driver(self) -> None:
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    
  def close_cookie_popup(self) -> None:
    try:
      cookie_button = self.driver.find_element(By.ID, "sigaa-cookie-consent-close")
      cookie_button.click()
      time.sleep(1)
    except NoSuchElementException:
      return

  def select_department(self) -> None:
    select = Select(self.driver.find_element(By.NAME, "formTurma:inputDepto"))
    select.select_by_visible_text("DEPTO CIÊNCIAS DA COMPUTAÇÃO - BRASÍLIA")
    
    search_button = self.driver.find_element(By.NAME, "formTurma:j_id_jsp_1370969402_11")
    self.driver.execute_script("arguments[0].click();", search_button)

  def get_available_courses(self) -> List[Course]:
    available_courses = []
    current_course = None
    
    elements = self.driver.find_elements(
      By.XPATH, 
      "//*[contains(@class, 'agrupador') or contains(@class, 'linhaPar') or contains(@class, 'linhaImpar')]"
    )
    
    for element in elements:
      class_name = element.get_attribute("class")
      if "agrupador" in class_name:
        current_course = element.text.strip()
        continue
        
      if not current_course or not any(key in current_course for key in self.COURSES):
        continue
        
      if "linha" not in class_name:
        continue
        
      columns = element.find_elements(By.TAG_NAME, "td")
      class_number = columns[0].text.strip()
      
      if class_number != self.COURSES[current_course]:
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
          location=columns[7].text.strip()
        )
        available_courses.append(course)
        
    return available_courses

  def check_seats(self) -> None:
    try:
      self.setup_driver()
      self.driver.get("https://sigaa.unb.br/sigaa/public/turmas/listar.jsf")
      
      self.close_cookie_popup()
      self.select_department()
      
      WebDriverWait(self.driver, 15).until(
        EC.presence_of_element_located((By.XPATH, "//table[@class='listagem']/tbody/tr"))
      )
      
      available_courses = self.get_available_courses()
      
      if available_courses:
        messages = [self._format_course_message(course) for course in available_courses]
        self.email_sender.send_email("your_email", messages)
        print("Email sent with available seats!")
      else:
        print("No available seats found in monitored courses.")
        
    finally:
      if self.driver:
        self.driver.quit()

  @staticmethod
  def _format_course_message(course: Course) -> str:
    return (f"Course: {course.name}\n"
        f"Class: {course.class_number}\n"
        f"Professor: {course.professor}\n"
        f"Schedule: {course.schedule}\n"
        f"Available seats: {course.available_seats}\n"
        f"Location: {course.location}\n")

class EmailSender:
  def __init__(self, email: str, password: str):
    self.email = email
    self.password = password

  def send_email(self, to_email: str, messages: List[str]) -> None:
    msg = MIMEText("\n".join(messages))
    msg["Subject"] = "Available Seats in Courses"
    msg["From"] = self.email
    msg["To"] = to_email
    
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
      server.starttls()
      server.login(self.email, self.password)
      server.sendmail(self.email, to_email, msg.as_string())

def main():
  monitor = UnbCourseMonitor()
  while True:
    monitor.check_seats()
    time.sleep(300)

if __name__ == "__main__":
  main()
