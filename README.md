# Temp Email

A simple static page to generate and read disposable emails using the [1secmail](https://www.1secmail.com/) API.

## How it works

`index.html` creates a unique mailbox when you click **Generate New Email**. The address is displayed on the page and the **Check for Messages** button becomes active. Use the domain dropdown to choose `1secmail.com`, `1secmail.org` or `1secmail.net` before generating. Clicking **Check for Messages** fetches messages for that inbox from the API. Selecting a message loads its contents and highlights sequences of 4–8 digits (useful for OTP codes).

## Prerequisites

- A modern web browser
- An active internet connection (API requests use the selected 1secmail domain)
- The page loads [DOMPurify](https://github.com/cure53/DOMPurify) from a CDN for sanitizing email content

## Run locally

1. Clone this repository or download `index.html`.
2. Open `index.html` directly in your browser. No server setup is required.

## Deploy with GitHub Pages

1. Push the repository to GitHub.
2. In the repo settings go to **Pages** and choose the `main` branch (root).
3. Save the configuration. GitHub will host the page at `https://<user>.github.io/<repo>/`.

The included workflow `.github/workflows/deploy.yml` shows an example of automating this deployment using GitHub Actions.

## Buttons overview

- **Generate New Email** – Creates a new temporary address and displays it.
- **Check for Messages** – Retrieves emails for the generated address and lists them. Disabled until an address is created.
- **Auto refresh** – When enabled, automatically checks for messages at the specified interval.

Opening a message displays the body with any 4–8 digit numbers highlighted so OTP codes stand out.

## License

This project is licensed under the [MIT License](LICENSE).
