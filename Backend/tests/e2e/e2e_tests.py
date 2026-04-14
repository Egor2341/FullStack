import re
from playwright.sync_api import expect

BASE_URL = "http://localhost:5173"


def test_login(page):
    page.goto(f"{BASE_URL}/welcome")

    page.get_by_role("button", name="Войти в сокровищницу").click()
    page.get_by_role("textbox", name="Email").fill("user@example.com")
    page.get_by_role("textbox", name="Пароль").fill("1111")
    page.get_by_role("button", name="Войти").click()

    expect(page).not_to_have_url(re.compile("welcome"))


def test_register(page):
    page.goto(f"{BASE_URL}/welcome")

    page.get_by_role("link", name="Зарегистрироваться").click()
    page.get_by_role("textbox", name="Email").fill("user1@example.com")
    page.get_by_role("textbox", name="Повторите пароль").fill("1111")
    page.locator("#confirm_password").fill("1111")
    page.get_by_role("button", name="Создать личный кабинет").click()


def test_user_crud(page):
    page.goto(f"{BASE_URL}/welcome")

    # login
    page.get_by_role("button", name="Войти в сокровищницу").click()
    page.get_by_role("textbox", name="Email").fill("user@example.com")
    page.get_by_role("textbox", name="Пароль").fill("1111")
    page.get_by_role("button", name="Войти").click()

    # CRUD действия
    page.get_by_role("button", name="Посмотреть").nth(2).click()

    page.get_by_role("textbox").first.fill("g")
    page.get_by_role("button", name="Добавить").first.click()

    page.get_by_role("textbox").first.fill("ttt")
    page.get_by_role("button", name="Добавить").first.click()

    page.get_by_role("textbox").nth(1).fill("qera")
    page.get_by_role("button").nth(3).click()
    page.get_by_role("button").nth(4).click()

    page.get_by_role("button", name="На главную").click()

    expect(page).to_have_url(re.compile("main"))


def test_admin_crud(page):
    page.goto(f"{BASE_URL}/welcome")

    page.get_by_role("button", name="Войти в сокровищницу").click()
    page.get_by_role("textbox", name="Email").fill("admin@treasury.com")
    page.get_by_role("textbox", name="Пароль").fill("pass1234")
    page.get_by_role("button", name="Войти").click()

    page.get_by_role("button", name="Посмотреть").nth(2).click()

    page.get_by_role("button").nth(2).click()
    page.get_by_role("button").nth(4).click()
    page.get_by_role("button").nth(3).click()

    page.get_by_role("button", name="На главную").click()

    expect(page).to_have_url(re.compile("main"))


def test_sort_pagination_and_s3(page):
    page.goto(f"{BASE_URL}/welcome")

    # login
    page.get_by_role("button", name="Войти в сокровищницу").click()
    page.get_by_role("textbox", name="Email").fill("user@example.com")
    page.get_by_role("textbox", name="Пароль").fill("1111")
    page.get_by_role("button", name="Войти").click()

    page.get_by_role("button", name="Посмотреть").nth(2).click()

    # пагинация
    page.get_by_role("button", name=">").nth(1).click()
    page.get_by_role("button", name="<").nth(1).click()

    # сортировка
    page.get_by_role("combobox").nth(1).select_option("По убыванию")

    page.get_by_role("button", name="На главную").click()

    # загрузка файла
    page.get_by_role("button", name="Посмотреть").nth(4).click()
    page.get_by_role("button", name="Загрузить").click()

    page.locator("input[type='file']").set_input_files("image.jpg")
    page.get_by_role("button", name="Загрузить").click()

    page.get_by_role("button", name="На главную").click()


def test_av_api(page):
    page.goto(f"{BASE_URL}/welcome")

    # login
    page.get_by_role("button", name="Войти в сокровищницу").click()
    page.get_by_role("textbox", name="Email").fill("user@example.com")
    page.get_by_role("textbox", name="Пароль").fill("1111")
    page.get_by_role("button", name="Войти").click()

    # page.get_by_role("button", name="Посмотреть").nth(5).click()

    expect(page).to_have_url(re.compile("main"))
