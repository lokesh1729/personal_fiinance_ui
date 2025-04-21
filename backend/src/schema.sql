-- Create enum types
CREATE TYPE account_type AS ENUM (
  'HDFC Bank Account',
  'Kotak Bank Account',
  'Equitas Bank Account',
  'Cash',
  'HDFC Credit Card',
  'Kotak Credit Card',
  'SBI Credit Card',
  'ICICI Credit Card',
  'Others',
  'Amazon Pay',
  'IDFC First Bank Account',
  'Fi Bank Account',
  'SBI Bank Account',
  'Freecharge',
  'Paytm Wallet',
  'Paytm Food Wallet',
  'Ola Money Postpaid',
  'Simpl',
  'IndusInd Credit Card',
  'Slice Credit Card',
  'DBS Bank Account',
  'Citi Bank Account'
);

CREATE TYPE txn_enum_type AS ENUM ('Credit', 'Debit', 'Others');

CREATE TYPE txn_category_type AS ENUM (
  'Salary',
  'Refund',
  'Cashback',
  'Investment Redemption',
  'Investments',
  'Loan',
  'Rent',
  'Bills',
  'Groceries',
  'Fruits & Vegetables',
  'Food & Dining',
  'Egg & Meat',
  'Household',
  'Health',
  'Personal Care',
  'Shopping',
  'Life Style',
  'Maintenance',
  'Fuel',
  'Travel',
  'Gifts',
  'Productivity',
  'Entertainment',
  'Donation',
  'ATM Withdrawal',
  'Ramya',
  'Misc',
  'Others'
);

-- Create transactions table
CREATE TABLE public.transactions (
  id serial4 NOT NULL,
  txn_date date NOT NULL,
  account public."account_type" NOT NULL,
  txn_type public."txn_enum_type" NOT NULL,
  txn_amount float8 NOT NULL,
  category public."txn_category_type" NOT NULL,
  tags text DEFAULT ''::text NULL,
  notes text DEFAULT ''::text NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz NULL,
  CONSTRAINT transactionss_pk PRIMARY KEY (id),
  CONSTRAINT transactionss_unique UNIQUE (txn_date, account, txn_type, txn_amount, category, tags, notes)
);

-- Create transaction_views table
CREATE TABLE public.transaction_views (
  id serial4 NOT NULL,
  view_name text NOT NULL,
  from_date_txn_date date NULL,
  to_date_txn_date date NULL,
  account public."account_type" NULL,
  txn_type public."txn_enum_type" NULL,
  txn_amount float8 NULL,
  category public."txn_category_type" NULL,
  tags text DEFAULT ''::text NULL,
  notes text DEFAULT ''::text NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz NULL,
  CONSTRAINT transaction_views_pk PRIMARY KEY (id),
  CONSTRAINT transaction_views_unique UNIQUE (view_name)
); 