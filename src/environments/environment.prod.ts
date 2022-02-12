export const environment = {
  production: true,
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
