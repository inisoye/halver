# Halver 💰

> A modern bill-splitting application for seamless expense sharing

A mobile application for splitting one-time bills (such as restaurant orders) and recurring bills (such as Netflix subscriptions). This repository contains source code for the [mobile](https://github.com/inisoye/halver/tree/master/mobile) application built with React Native and Expo, the [API](https://github.com/inisoye/halver/tree/master/api) built with Django and Django Rest Framework, and a [landing page](https://halverapp.com/) built with Astro.

## 🎯 Overview

Halver simplifies the process of splitting bills among friends, family, or colleagues. Whether it's a one-time dinner expense or a recurring subscription service, Halver handles automatic payments, tracks contributions, and manages settlements seamlessly through the Paystack payment gateway.

## ✨ Features

### API

- 🔐 Social authentication with Apple and Google OAuth
- 💳 Immediate contributor charging and creditor settlement via the Paystack API
- 🔄 Recurring charging and settlements based on user-selected intervals
- 👥 Record of unregistered bill participants and automatic addition to bills when these participants register
- 📊 Record of arrears on bills to allow for late payments
- 🔔 Push notifications and real-time updates

### Mobile

- 🎨 Fully themed with dark and light mode colours
- 🔐 Social authentication with Apple and Google OAuth on iOS and Google OAuth on Android
- 🧮 Split breakdown screen that automatically reacts and recalculates contribution allocations when the user makes edits
- ⚡ Performant layout animations
- 📇 Add bill participants from contact list
- 🔔 Push notifications and real-time updates
- 🔒 Biometric authentication for payments

## 📱 Screenshots

### Home Screen

<img src="https://res.cloudinary.com/dvqa4te6q/image/upload/v1698562686/screenshots/home_dark_lvhe9r.jpg" width="250" alt="Dark mode home screen">
<img src="https://res.cloudinary.com/dvqa4te6q/image/upload/v1698562684/screenshots/home_light_etvewh.png" width="250" alt="Light mode home screen">

### Bill contribution allocation screen

<img src="https://res.cloudinary.com/dvqa4te6q/image/upload/v1698562684/screenshots/breakdown_dark_ijqwfw.png" width="250" alt="Dark mode allocation screen">
<img src="https://res.cloudinary.com/dvqa4te6q/image/upload/v1698562684/screenshots/breakdown_light_vgc6uz.png" width="250" alt="Light mode allocation screen">

### Single bill screen

<img src="https://res.cloudinary.com/dvqa4te6q/image/upload/v1698562685/screenshots/bill_dark_isi2n6.png" width="250" alt="Dark mode allocation screen">
<img src="https://res.cloudinary.com/dvqa4te6q/image/upload/v1698562683/screenshots/bill_light_rdysuy.png" width="250" alt="Light mode allocation screen">

## 🔧 Environment Variables

All environment variables needed to run this project have been listed in `.env.example` files.

## 🚀 Run Locally

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.9 or higher)
- Poetry
- Expo CLI
- iOS Simulator or Android Emulator (for mobile development)

### Getting Started

Clone the project:

```bash
git clone git@github.com:inisoye/halver.git
```

Navigate to the project directory:

```bash
cd halver
```

### 🔧 Run API Code

Navigate to the API directory:

```bash
cd api
```

Install dependencies using Poetry:

```bash
poetry install
```

Start the development server:

```bash
poetry run python manage.py runserver
```

### 📱 Run Mobile Code

Navigate to the mobile directory:

```bash
cd mobile
```

Install dependencies:

```bash
npm install
```

Install the app on Expo Development Build:

**For iOS:**

```bash
npm run install-ios
```

**For Android:**

```bash
npm run install-android
```

Start the development server:

```bash
npm run dev
```

### 🌐 Run Landing Page Code

Navigate to the site directory:

```bash
cd site
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

## 🛠️ Tech Stack

### API

- **Framework:** Django & Django Rest Framework
- **Payment Processing:** Paystack API
- **Authentication:** OAuth (Apple & Google)
- **Package Manager:** Poetry
- **Database:** MySQL/PostgreSQL compatible

### Mobile

- **Framework:** React Native with Expo
- **Authentication:** Social OAuth (Apple & Google)
- **Notifications:** Push notifications
- **Security:** Biometric authentication
- **State Management:** React hooks and context

### Landing Page

- **Framework:** Astro
- **Styling:** Tailwind CSS
- **Deployment:** Modern static hosting

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 📧 Contact

For questions or feedback, please visit [halverapp.com](https://halverapp.com/)
