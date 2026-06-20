/* eslint-disable import/no-anonymous-default-export */
export default [
  {
    expectation_type: "expect_column_values_to_be_unique",
    dq_dimension: "uniqueness",
    rule_type: "column",

    kwargs: {
      mostly: 0.8,
      cost: 0,
      column: "column_name",
    },
  },
  // {
  //   expectation_type: "expect_column_values_number_of_decimal_places_to_equal",
  //   dq_dimension: "precision",
  //   rule_type: "column",

  //   kwargs: {
  //     mostly: 0.8,
  //     cost: 0,
  //     column: "column_name",
  //     decimal_places: 0,
  //   },
  // },
  {
    expectation_type: "expect_compound_columns_to_be_unique",
    dq_dimension: "uniqueness",
    rule_type: "column",

    kwargs: {
      mostly: 0.8,
      cost: 0,
      column_list: ["column_name"],
    },
  },
  {
    expectation_type: "expect_column_values_to_be_between",
    dq_dimension: "validity",
    rule_type: "column",

    kwargs: {
      mostly: 0.8,
      cost: 0,
      column: "column_name",
      min_value: 0,
      max_value: 100,
    },
  },

  {
    expectation_type: "expect_column_values_to_be_of_type",
    dq_dimension: "accuracy",
    rule_type: "column",

    kwargs: {
      mostly: 0.8,
      cost: 0,
      column: "column_name",
      type_: "type",
    },
  },
  // {
  //   expectation_type: "expect_column_values_to_be_in_set",
  //   dq_dimension: "accuracy",
  //   rule_type: "column",

  //   kwargs: {
  //     mostly: 0.8,
  //     cost: 0,
  //     column: "column_name",
  //     value_set: ["your_set_of_values"],
  //   },
  // },
  // {
  //   expectation_type: "expect_column_values_to_contain_valid_email",
  //   dq_dimension: "uniqueness",
  //   rule_type: "column",

  //   kwargs: {
  //     mostly: 0.8,
  //     cost: 0,
  //     column: "column_name",
  //   },
  // },
  {
    expectation_type: "expect_column_values_to_match_regex",
    dq_dimension: "validity",
    rule_type: "column",

    kwargs: {
      mostly: 0.8,
      cost: 0,
      column: "column_name",
      regex: "regex",
    },
  },
  {
    expectation_type: "expect_column_values_to_not_be_null",
    dq_dimension: "completeness",
    rule_type: "column",

    kwargs: {
      mostly: 0.8,
      cost: 0,
      column: "column_name",
    },
  },
  {
    expectation_type: "expect_column_values_to_match_strftime_format",
    dq_dimension: "completeness",
    rule_type: "column",

    kwargs: {
      mostly: 0.8,
      cost: 0,
      column: "column_name",
      strftime_format: "strftime format",
    },
  },
  {
    expectation_type: "expect_multicolumn_sum_to_equal",
    dq_dimension: "integrity",
    rule_type: "aggregate",

    kwargs: {
      mostly: 0.8,
      cost: 0,
      column_list: ["column_list"],
      sum_total: "sum_total",
    },
  },
  // {
  //   expectation_type: "expect_foreign_keys_in_column_a_to_exist_in_column_b",
  //   dq_dimension: "completeness",
  //   rule_type: "aggregate",

  //   kwargs: {
  //     mostly: 0.8,
  //     cost: 0,
  //     column_a: "column_a",
  //     column_b: "column_b",
  //   },
  // },
  {
    expectation_type: "expect_column_pair_values_to_be_equal",
    dq_dimension: "consistency",
    rule_type: "aggregate",

    kwargs: {
      mostly: 0.8,
      cost: 0,
      column_list: ["column_list"],
    },
  },
  {
    expectation_type: "expect_table_row_count_to_equal",
    rule_type: "table",
    dq_dimension: "accuracy",

    kwargs: {
      mostly: 0.8,
      cost: 0,
      value: "value",
    },
  },
  {
    expectation_type: "expect_table_row_count_to_be_between",
    rule_type: "table",
    dq_dimension: "completeness",

    kwargs: {
      mostly: 0.8,
      cost: 0,
      min_value: 0,
      max_value: 100,
    },
  },
  {
    expectation_type: "expect_table_columns_to_match_set",
    rule_type: "table",
    dq_dimension: "accuracy",

    kwargs: {
      mostly: 0.8,
      cost: 0,
      column_set: ["column_set"],
      exact_match: "exact_match",
    },
  },
  {
    expectation_type: "expect_table_columns_to_match_ordered_list",
    rule_type: "table",
    dq_dimension: "accuracy",

    kwargs: {
      mostly: 0.8,
      cost: 0,
      column_list: ["column_list"],
    },
  },
  {
    expectation_type: "expect_table_column_count_to_equal",
    rule_type: "table",
    dq_dimension: "completeness",

    kwargs: {
      mostly: 0.8,
      cost: 0,
      value: "value",
    },
  },
  {
    expectation_type: "expect_table_column_count_to_be_between",
    rule_type: "table",
    dq_dimension: "completeness",

    kwargs: {
      mostly: 0.8,
      cost: 0,
      min_value: 0,
      max_value: 100,
    },
  },
  // {
  //   expectation_type: "expect_table_row_count_to_equal_other_table",
  //   rule_type: "table",
  //   dq_dimension: "accuracy",

  //   kwargs: {
  //     mostly: 0.8,
  //     cost: 0,
  //     other_table_name: "other_table_name",
  //   },
  // },
  {
    expectation_type: "expect_column_values_to_not_match_regex_list",
    rule_type: "column",
    dq_dimension: "validity",

    kwargs: {
      mostly: 0.8,
      cost: 0,
      column: "column_name",
      regex_list: "regex_list",
    },
  },
  {
    expectation_type: "expect_column_values_to_not_match_regex",
    rule_type: "column",
    dq_dimension: "validity",

    kwargs: {
      mostly: 0.8,
      cost: 0,
      column: "column_name",
      regex: "regex",
    },
  },
  // {
  //   expectation_type: "expect_column_values_to_not_match_like_pattern_list",
  //   rule_type: "column",
  //   dq_dimension: "validity",

  //   kwargs: {
  //     mostly: 0.8,
  //     cost: 0,
  //     column: "column_name",
  //     like_pattern_list: "like_pattern_list",
  //   },
  // },
  // {
  //   expectation_type: "expect_column_values_to_not_match_like_pattern",
  //   rule_type: "column",
  //   dq_dimension: "validity",

  //   kwargs: {
  //     mostly: 0.8,
  //     cost: 0,
  //     column: "column_name",
  //     like_pattern: "like_pattern",
  //   },
  // },
  // {
  //   expectation_type: "expect_column_values_to_not_contain_character",
  //   rule_type: "column",
  //   dq_dimension: "uniqueness",

  //   kwargs: {
  //     mostly: 0.8,
  //     cost: 0,
  //     column: "column_name",
  //     character: "character",
  //   },
  // },
  // {
  //   expectation_type: "expect_column_values_to_be_secure_passwords",
  //   rule_type: "column",
  //   dq_dimension: "integrity",

  //   kwargs: {
  //     mostly: 0.8,
  //     cost: 0,
  //     column: "column_name",
  //     min_length: "min_length",
  //     min_uppercase: "min_uppercase",
  //     min_lowercase: "min_lowercase",
  //     min_special: "min_special",
  //     min_digits: "min_digits",
  //     max_consec_numbers: "max_consec_numbers",
  //     max_consec_letters: "max_consec_letters",
  //   },
  // },
  {
    expectation_type: "expect_column_values_to_be_null",
    rule_type: "column",
    dq_dimension: "accuracy",

    kwargs: {
      mostly: 0.8,
      cost: 0,
      column: "column_name",
    },
  },
  // {
  //   expectation_type: "expect_column_values_to_be_xml_parseable",
  //   rule_type: "column",
  //   dq_dimension: "accessibility",

  //   kwargs: {
  //     mostly: 0.8,
  //     cost: 0,
  //     column: "column_name",
  //   },
  // },
  // {
  //   expectation_type: "expect_column_values_to_be_json_parseable",
  //   rule_type: "column",
  //   dq_dimension: "accessibility",

  //   kwargs: {
  //     mostly: 0.8,
  //     cost: 0,
  //     column: "column_name",
  //   },
  // },
  {
    expectation_type: "expect_column_values_to_match_regex_list",
    rule_type: "column",
    dq_dimension: "validity",

    kwargs: {
      mostly: 0.8,
      cost: 0,
      column: "column_name",
      regex_list: ["list_of_regex"],
    },
  },
  {
    expectation_type: "expect_column_values_to_not_be_in_set",
    rule_type: "column",
    dq_dimension: "accuracy",

    kwargs: {
      mostly: 0.8,
      cost: 0,
      column: "column_name",
      value_set: "value_set",
    },
  },
  // {
  //   expectation_type: "expect_column_values_to_match_xml_schema",
  //   rule_type: "column",
  //   dq_dimension: "integrity",

  //   kwargs: {
  //     mostly: 0.8,
  //     cost: 0,
  //     column: "column_name",
  //     xml_schema: "xml_schema",
  //   },
  // },
  {
    expectation_type: "expect_column_values_to_match_json_schema",
    rule_type: "column",
    dq_dimension: "validity",

    kwargs: {
      mostly: 0.8,
      cost: 0,
      column: "column_name",
      json_schema: "json_schema",
    },
  },
  {
    expectation_type: "expect_column_min_to_be_between",
    rule_type: "aggregate",
    dq_dimension: "consistency",

    kwargs: {
      mostly: 0.8,
      cost: 0,
      column: "column_name",
      min_value: 0,
      max_value: 100,
    },
  },
  {
    expectation_type: "expect_column_median_to_be_between",
    rule_type: "aggregate",
    dq_dimension: "consistency",

    kwargs: {
      mostly: 0.8,
      cost: 0,
      column: "column_name",
      min_value: 0,
      max_value: 100,
    },
  },
  {
    expectation_type: "expect_column_mean_to_be_between",
    rule_type: "aggregate",
    dq_dimension: "consistency",

    kwargs: {
      mostly: 0.8,
      cost: 0,
      column: "column_name",
      min_value: 0,
      max_value: 100,
    },
  },
  {
    expectation_type: "expect_column_max_to_be_between",
    rule_type: "aggregate",
    dq_dimension: "consistency",

    kwargs: {
      mostly: 0.8,
      cost: 0,
      column: "column_name",
      min_value: 0,
      max_value: 100,
    },
  },
  {
    expectation_type: "expect_select_column_values_to_be_unique_within_record",
    rule_type: "aggregate",
    dq_dimension: "uniqueness",

    kwargs: {
      mostly: 0.8,
      cost: 0,
      column_list: ["column_list"],
    },
  },
  // {
  //   expectation_type: "expect_column_values_to_not_contain_special_characters",
  //   rule_type: "column",
  //   dq_dimension: "uniqueness",

  //   kwargs: {
  //     mostly: 0.8,
  //     cost: 0,
  //     column: "column_name",
  //   },
  // },
  // {
  //   expectation_type: "expect_column_values_to_not_be_outliers",
  //   rule_type: "column",
  //   dq_dimension: "validity",

  //   kwargs: {
  //     mostly: 0.8,
  //     cost: 0,
  //     column: "column_name",
  //     method: "std",
  //     multiplier: "multiplier",
  //   },
  // },
  // {
  //   expectation_type: "expect_column_values_to_match_like_pattern_list",
  //   rule_type: "column",
  //   dq_dimension: "validity",

  //   kwargs: {
  //     mostly: 0.8,
  //     cost: 0,
  //     column: "column_name",
  //     like_pattern_list: ["like_pattern_list"],
  //   },
  // },
  // {
  //   expectation_type: "expect_column_values_to_match_like_pattern",
  //   rule_type: "column",
  //   dq_dimension: "validity",

  //   kwargs: {
  //     mostly: 0.8,
  //     cost: 0,
  //     column: "column_name",
  //     like_pattern: "like_pattern",
  //   },
  // },
  // {
  //   expectation_type: "expect_column_values_to_follow_rule",
  //   rule_type: "column",
  //   dq_dimension: "integrity",

  //   kwargs: {
  //     mostly: 0.8,
  //     cost: 0,
  //     column: "column_name",
  //     rule_expression: "rule_expression",
  //   },
  // },
  // {
  //   expectation_type: "expect_column_values_to_change_between",
  //   rule_type: "column",
  //   dq_dimension: "precision",

  //   kwargs: {
  //     mostly: 0.8,
  //     cost: 0,
  //     column: "column_name",
  //     from_value: "from_value",
  //     to_value: "to_value",
  //   },
  // },
  // {
  //   expectation_type: "expect_column_values_to_be_valid_wikipedia_articles",
  //   rule_type: "column",
  //   dq_dimension: "integrity",

  //   kwargs: {
  //     mostly: 0.8,
  //     cost: 0,
  //     column: "column_name",
  //   },
  // },
  // {
  //   expectation_type: "expect_column_values_to_be_valid_urls",
  //   rule_type: "column",
  //   dq_dimension: "integrity",

  //   kwargs: {
  //     mostly: 0.8,
  //     cost: 0,
  //     column: "column_name",
  //   },
  // },
  {
    expectation_type: "expect_column_values_to_be_increasing",
    rule_type: "column",
    dq_dimension: "precision",

    kwargs: {
      mostly: 0.8,
      cost: 0,
      column: "column_name",
    },
  },
  {
    expectation_type: "expect_column_values_to_be_decreasing",
    rule_type: "column",
    dq_dimension: "precision",

    kwargs: {
      mostly: 0.8,
      cost: 0,
      column: "column_name",
    },
  },
  {
    expectation_type: "expect_column_unique_value_count_to_be_between",
    rule_type: "column",
    dq_dimension: "accessibility",

    kwargs: {
      mostly: 0.8,
      cost: 0,
      column: "column_name",
      min_value: 0,
      max_value: 100,
    },
  },
];
