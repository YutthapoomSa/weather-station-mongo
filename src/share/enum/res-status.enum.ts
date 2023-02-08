export enum ResStatus {
    success = '0000',
    fail = '1000',
    fail_reward_empty = '1001',
    fail_pointUser = '1002',
    fail_phoneNumber_has_been_used = '1003',
    fail_email_has_been_used = '1004',
    fail_username_has_been_used = '1005',
    fail_cannot_find_user = '1006',
    fail_support_is_not_enough = '1007',
    fail_support_does_not_have_process_amount = '1008',
    fail_pointUser_or_privileges_is_greater_than_user = '1009',
    fail_privilege_empty = '1010',
}
