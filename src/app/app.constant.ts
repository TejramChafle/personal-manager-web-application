// Application pages
export const pages = {
    RETURNING: 'returnings',
    EXPENDITURE: 'expenditures',
    REMINDER: 'reminders',
    TASK: 'tasks',
    GROCERY: 'groceries',
    LEARNING: 'learnings',
    TIMESHEET: 'timesheets'
}

// Modes/Methods of payments
export const paymentMethods = [
    'Cash',
    'Credit Card',
    'Debit Card',
    'Google Pay',
    'PayTM',
    'Other'
];

// Purpose of expenditure
export const purposeTypes = [
    'Rent',
    'Bike',
    'Fuel',
    'Grocery',
    'Transportation',
    'Telephone',
    'Hospital',
    'Insurance',
    'Entertainment',
    'Shopping',
    'Canteen',
    'Food',
    'Utilities',
    'Membership',
    'Other'
];

// TAG/Labels at for the tasks
export const taskLabels = [
    { name: 'Mobile', color: '#82caaf', isChecked: false },
    { name: 'Frontend', color: '#b676b1', isChecked: false },
    { name: 'Backend', color: '#194a8d', isChecked: false },
    { name: 'API', color: '#fecf6a', isChecked: false },
    { name: 'Learning', color: '#75c0e0', isChecked: false },
    { name: 'Office', color: '#75c0e0', isChecked: false },
    { name: 'Help', color: '#b676b1', isChecked: false },
    { name: 'Other', color: '#8F3985', isChecked: false }
];

export const sortOptions = [
    {
        icon: 'today',
        name: 'Date',
        type: 'Recent',
        endicon: 'arrow_upward',
        visibleOn: [pages.EXPENDITURE, pages.RETURNING, pages.REMINDER, pages.TASK, pages.GROCERY, pages.LEARNING, pages.TIMESHEET]
    },
    {
        icon: 'today',
        name: 'Date',
        type: 'Older',
        endicon: 'arrow_downward',
        visibleOn: [pages.EXPENDITURE, pages.RETURNING, pages.REMINDER, pages.TASK, pages.GROCERY, pages.LEARNING, pages.TIMESHEET]
    },
    {
        icon: 'attach_money',
        name: 'Payment Status',
        type: 'Paid',
        endicon: 'done_all',
        visibleOn: [pages.RETURNING, pages.GROCERY]
    },
    {
        icon: 'attach_money',
        name: 'Payment Status',
        type: 'Unpaid',
        endicon: 'remove_done',
        visibleOn: [pages.RETURNING, pages.GROCERY]
    },
    {
        icon: 'payments',
        name: 'Bill Amount',
        type: 'Lowest',
        endicon: 'arrow_upward',
        visibleOn: [pages.EXPENDITURE, pages.RETURNING, pages.GROCERY]
    },
    {
        icon: 'payments',
        name: 'Bill Amount',
        type: 'Highest',
        endicon: 'arrow_downward',
        visibleOn: [pages.EXPENDITURE, pages.RETURNING, pages.GROCERY]
    },
    {
        icon: 'sort_by_alpha',
        name: 'Sort by alphabet',
        type: 'A -> Z',
        endicon: 'arrow_downward',
        visibleOn: [pages.EXPENDITURE, pages.RETURNING, pages.REMINDER, pages.TASK, pages.GROCERY, pages.LEARNING, pages.TIMESHEET]
    },
    {
        icon: 'sort_by_alpha',
        name: 'Sort by alphabet',
        type: 'Z -> A',
        endicon: 'arrow_upward',
        visibleOn: [pages.EXPENDITURE, pages.RETURNING, pages.REMINDER, pages.TASK, pages.GROCERY, pages.LEARNING, pages.TIMESHEET]
    },
    {
        icon: 'assignment',
        name: 'Task',
        type: 'Complete',
        endicon: 'assignment_turned_in',
        visibleOn: [pages.TASK]
    },
    {
        icon: 'assignment',
        name: 'Task',
        type: 'Incomple',
        endicon: 'assignment_late',
        visibleOn: [pages.TASK]
    },
    {
        icon: 'star_rate',
        name: 'Star',
        type: 'Marked',
        endicon: 'star_grade',
        visibleOn: [pages.TASK]
    },
    {
        icon: 'star_rate',
        name: 'Star',
        type: 'Not Marked',
        endicon: 'star_grade',
        visibleOn: [pages.TASK]
    }
];