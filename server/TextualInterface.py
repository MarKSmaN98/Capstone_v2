from textual.app import App
from textual.widgets import Header, Footer, Button, Static, Input, DataTable, ContentSwitcher
from textual.screen import Screen
from textual.containers import Container, Horizontal
from models import User, Item, Cart, CartItem
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

class Model():

    def __init__(self):
        engine = create_engine('sqlite:///instance/app.db')
        Session = sessionmaker(bind=engine)
        self.session = Session()
        self.users = [user for user in self.session.query(User)]
        self.items = [item for item in self.session.query(Item)]
        self.carts = [cart for cart in self.session.query(Cart)]
        self.cart_items = [ci for ci in self.session.query(CartItem)]


class Login(Screen ):
    pass

class HostInterface(App):

    
    data = Model()

    CSS_PATH = 'tui.css'
    SCREENS = {}
    BINDINGS = [('d', 'toggle_dark', 'Toggle Dark Mode' ), ('q', 'exit', 'Quit')]

    def compose(self):
        yield Header(show_clock=True)
        yield Footer()

    def action_toggle_dark(self):
        self.dark = not self.dark

    def action_exit(self):
        self.exit("Exiting...")

if __name__ == '__main__':
    
    app = HostInterface()
    app.run()