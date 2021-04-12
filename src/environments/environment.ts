// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json?`.

export const environment = {
  production: false,
  // API_URL: 'https://ng-personal-manager.firebaseio.com/',
  API_URL: 'https://personal-manager-services.herokuapp.com/',
  API_KEY: 'AIzaSyDrF3MrUSxyKzSCnHZjWy8gcynUUxknr_g',
  FIREBASE_CONFIG: {
    apiKey: "AIzaSyDrF3MrUSxyKzSCnHZjWy8gcynUUxknr_g",
    authDomain: "ng-personal-manager.firebaseapp.com",
    databaseURL: "https://ng-personal-manager.firebaseio.com",
    projectId: "ng-personal-manager",
    storageBucket: "ng-personal-manager.appspot.com",
    messagingSenderId: "1072996084283",
    appId: "1:1072996084283:web:7f4aa09a1f540309008a1e",
    measurementId: "G-ER0C9LMQVZ"
  }
};

export const pages = {
  RETURNING: 'returnings',
  EXPENDITURE: 'expenditures',
  REMINDER: 'reminders',
  TASK: 'tasks',
  GROCERY: 'groceries',
  LEARNING: 'learnings',
  TIMESHEET: 'timesheets'
}

// authDomain: 'ng-personal-manager.firebaseapp.com',

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
