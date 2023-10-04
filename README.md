# DiscordBot

## Table of Contents
- [Getting Started](#getting-started)
- [Commands](#commands)
  - [auto-reply Command](#auto-reply-Command)
  - [Remind Command](#remind-command)
- [FAQs](#faqs)
- [Support](#support)

## Getting Started

...

## Commands

### auto-reply Command

Set up an Auto Reply when you status is dnd, use the following command:

`/auto-reply modify <message>   
/auto-reply toggle <true/false>`

- `<message>`: The auto reply message content

Example usage:

/auto-reply modify Hi
[bot]: Auto Reply Message is now 'Hi'

/auto-reply toggle false
[bot]: Auto Reply is now off

### Remind Command

The `/remind` command allows you to set reminders for yourself. Here's how you can use it:
/remind <period> <timeStart> <message>

- `<period>`: Choose the reminder period (`once`, `hourly`, `daily`, `weekly`, `monthly`, `yearly`).
- `<timeStart>`: Enter the starting time for the reminder, formatted as `YYYY-MM-DD HH:MM:SS`.
- `<message>`: Enter the content of the reminder.
  
Example usage:

/remind daily 2023-09-30 12:00:00 Don't forget the meeting!

## FAQs

...
