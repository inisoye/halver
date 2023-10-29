# Halver

A mobile application for splitting one-time bills (such as restaurant orders) and recurring bills (such as a Netflix subscription). This repository contains source for the [mobile](https://github.com/inisoye/halver/tree/master/mobile) application built with React Native, the [api](https://github.com/inisoye/halver/tree/master/api) built with Django and the Django Rest Framework and a [landing page](https://halverapp.com/) built with Astro.

## Features

### API

- Social authentication with Apple and Google OAuth.
- Immediate contributor charging and creditor settlement via the Paystack API.
- Recurring charging and settlements based on user-selected intervals.
- Record of unregistered bill participants and automatic addition to bills when these participant's register.
- Record of arrears on bills to allow for late payments.
- Push notifications.

### Mobile

- Fully themed with dark and light mode colours.
- Social authentication with Apple and Google OAuth on IOS and Google OAuth on Android.
- Split breakdown screen that automatically reacts and recalculates contribution allocations when the user makes edits.
- Performant layout animations.
- Add bill participants from contact list
- Push notifications
- Biometric authentication for payments.

## Screenshots

### Home Screen

<img src="https://res.cloudinary.com/dvqa4te6q/image/upload/v1698562686/screenshots/home_dark_lvhe9r.jpg" width="250" alt="Dark mode home screen">
<img src="https://res.cloudinary.com/dvqa4te6q/image/upload/v1698562684/screenshots/home_light_etvewh.png" width="250" alt="Light mode home screen">

### Bill contribution allocation screen

<img src="https://res.cloudinary.com/dvqa4te6q/image/upload/v1698562684/screenshots/breakdown_dark_ijqwfw.png" width="250" alt="Dark mode allocation screen">
<img src="https://res.cloudinary.com/dvqa4te6q/image/upload/v1698562684/screenshots/breakdown_light_vgc6uz.png" width="250" alt="Light mode allocation screen">

### Single bill screen

<img src="https://res.cloudinary.com/dvqa4te6q/image/upload/v1698562685/screenshots/bill_dark_isi2n6.png" width="250" alt="Dark mode allocation screen">
<img src="https://res.cloudinary.com/dvqa4te6q/image/upload/v1698562683/screenshots/bill_light_rdysuy.png" width="250" alt="Light mode allocation screen">

## Environment Variables

All environment variables needed to run this project have been listed in .env.example files

## Run Locally

Clone the project

```bash
  git clone git@github.com:inisoye/halver.git
```

Go to the project directory

```bash
  cd halver
```

### Run API Code

Go to the api directory

```bash
  cd api
```

Install dependencies

```bash
  poetry install
```

Start the server

```bash
  poetry run python manage.py runserver
```

### Run Mobile Code

Go to the mobile directory

```bash
  cd mobile
```

Install dependencies

```bash
  npm install
```

Install app on Expo Development Build

```bash
  npm run install-ios
```

or

```bash
  npm run install-android
```

Start the server

```bash
  npm run dev
```

### Run Landing Page Code

Go to the site directory

```bash
  cd site
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```
