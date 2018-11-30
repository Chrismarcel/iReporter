# iReporter

iReporter is an web platform that enables any/every citizen to bring any form of corruption to the notice of appropriate authorities and the general public and also report on things that needs government intervention.

[![Build Status](https://travis-ci.com/Chrismarcel/iReporter.svg?branch=develop)](https://travis-ci.com/Chrismarcel/iReporter)
[![Maintainability](https://api.codeclimate.com/v1/badges/579d83e8e360731ae057/maintainability)](https://codeclimate.com/github/Chrismarcel/iReporter/maintainability)
[![Coverage Status](https://img.shields.io/coveralls/github/Chrismarcel/iReporter.svg?style=popout)](https://coveralls.io/github/Chrismarcel/iReporter?branch=develop)
[![Github issues](https://img.shields.io/github/issues-raw/Chrismarcel/iReporter.svg?style=popout)](https://github.com/Chrismarcel/iReporter/issues)
[![GitHub](https://img.shields.io/github/license/Chrismarcel/iReporter.svg?style=popout)](https://github.com/Chrismarcel/iReporter/blob/develop/LICENSE)

## Required Features

- Users can sign up
- Users can login
- Users can make a new report (A red flag or intervention)
- Users can edit their reports
- Users can delete their reports
- Users can add geolocation to their report
- Users can change the geolocation of their report
- Admin can change status of the report (drafted, under investigation, resolved, rejected)

## Technologies

- Node JS
- Express
- Mocha & Chai
- ESLint
- Babel
- Travis CI
- Code Climate & Coveralls

## Requirements and Installation
To install and run this project you would need to have installed:
- Node Js
- Git

To run:
```
$ git clone https://github.com/Chrismarcel/iReporter.git
$ cd iReporter
$ npm install
$ npm start
```
## Testing
```
$ npm test
```

## Pivotal Tracker stories
[https://www.pivotaltracker.com/n/projects/2227345](https://www.pivotaltracker.com/n/projects/2227345)

## Template UI

You can see a hosted version of the template at [https://chrismarcel.github.io/iReporter/UI](https://chrismarcel.github.io/iReporter/UI)

## API

The API is currently in version 1 (v1) and is hosted at [https://ireporter-api.herokuapp.com](https://ireporter-api.herokuapp.com)

## API Endpoints

| Endpoint                                         | Functionality                            |
| ------------------------------------------------ | -----------------------------------------|
| GET /red-flags                                   | Fetch all red-flags reports              |
| GET /red-flags/\<red-flag-id>                    | Fetch the details of a single red-flag   |
| PATCH /red-flags/\<red-flag-id>/location         | Update the location of a red-flag report |
| PATCH /red-flags/\<red-flag-id>/comment          | Update the comment of a red-flag report  |
| DELETE /red-flags/\<red-flag-id>                 | Delete a single red-flag                 |

## Author

James Chrismarcel

## License

This is licensed for your use, modification and distribution under the [MIT license.](https://opensource.org/licenses/MIT)
