document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "Robusta Brazil", img: "1.jpg", price: 20000 },
      { id: 2, name: "Arabica Blend", img: "2.jpg", price: 25000 },
      { id: 3, name: "Primo Passo", img: "3.jpg", price: 30000 },
      { id: 4, name: "Aceh Gayo", img: "4.jpg", price: 35000 },
      { id: 5, name: "Sumatra Mandheling", img: "5.jpg", price: 40000 },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      const cartItem = this.items.find((item) => item.id === newItem.id);

      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        this.items = this.items.map((item) => {
          if (item.id !== newItem.id) {
            return item;
          } else {
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      const cartItem = this.items.find((item) => item.id === id);

      if (cartItem.quantity > 1) {
        this.items = this.items.map((item) => {
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        })
      } else if (cartItem.quantity === 1) {
        this.items = this.items.filter((item) => item.id !== id)
        this.quantity--;
        this.total -= cartItem.price;
      }
    }
  });
});

const checkoutButton = document.querySelector('.checkout-button');
const form = document.querySelector('#checkoutForm');

form.addEventListener('keyup', () => {
  const inputs = form.querySelectorAll('input');
  const allFilled = [...inputs].every(input => input.value.trim() !== '');

  checkoutButton.disabled = !allFilled;
  checkoutButton.classList.toggle('disabled', !allFilled);
});

// Send Data While Checkout
checkoutButton.addEventListener('click', function (e) {
  e.preventDefault()
  const formData = new FormData(form)
  const data = new URLSearchParams(formData)
  const objData = Object.fromEntries(data)
  const message = formatMessage(objData)
  window.open('http://wa.me/+62895701615080?text=' + encodeURIComponent(message))
})

// Whatsapp Message Format
const formatMessage = (obj) => {
  return `Data Customer
    Nama: ${obj.name}
    Email: ${obj.email}
    No HP: ${obj.phone}
  Data Pesanan
  ${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`)}
  TOTAL: ${rupiah(obj.total)}
  Terima Kasih.
  `
}

// Convert Ke Rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
