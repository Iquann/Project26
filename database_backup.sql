--
-- PostgreSQL database dump
--

\restrict XoXzXH6Jnr0C203wotZatDxgR0XhuSA6EN0ZhWj8gwooL9N3falJamlQhI81ZmZ

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: stripe; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA stripe;


ALTER SCHEMA stripe OWNER TO postgres;

--
-- Name: invoice_status; Type: TYPE; Schema: stripe; Owner: postgres
--

CREATE TYPE stripe.invoice_status AS ENUM (
    'draft',
    'open',
    'paid',
    'uncollectible',
    'void',
    'deleted'
);


ALTER TYPE stripe.invoice_status OWNER TO postgres;

--
-- Name: pricing_tiers; Type: TYPE; Schema: stripe; Owner: postgres
--

CREATE TYPE stripe.pricing_tiers AS ENUM (
    'graduated',
    'volume'
);


ALTER TYPE stripe.pricing_tiers OWNER TO postgres;

--
-- Name: pricing_type; Type: TYPE; Schema: stripe; Owner: postgres
--

CREATE TYPE stripe.pricing_type AS ENUM (
    'one_time',
    'recurring'
);


ALTER TYPE stripe.pricing_type OWNER TO postgres;

--
-- Name: subscription_schedule_status; Type: TYPE; Schema: stripe; Owner: postgres
--

CREATE TYPE stripe.subscription_schedule_status AS ENUM (
    'not_started',
    'active',
    'completed',
    'released',
    'canceled'
);


ALTER TYPE stripe.subscription_schedule_status OWNER TO postgres;

--
-- Name: subscription_status; Type: TYPE; Schema: stripe; Owner: postgres
--

CREATE TYPE stripe.subscription_status AS ENUM (
    'trialing',
    'active',
    'canceled',
    'incomplete',
    'incomplete_expired',
    'past_due',
    'unpaid',
    'paused'
);


ALTER TYPE stripe.subscription_status OWNER TO postgres;

--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  new._updated_at = now();
  return NEW;
end;
$$;


ALTER FUNCTION public.set_updated_at() OWNER TO postgres;

--
-- Name: set_updated_at_metadata(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_updated_at_metadata() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  new.updated_at = now();
  return NEW;
end;
$$;


ALTER FUNCTION public.set_updated_at_metadata() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_items (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    product_id character varying NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.cart_items OWNER TO postgres;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    icon text,
    image_url text,
    brand text DEFAULT 'forge'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    order_id character varying NOT NULL,
    product_id character varying NOT NULL,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    name text NOT NULL,
    image_url text
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    shipping numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    tax numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    total numeric(10,2) NOT NULL,
    shipping_address jsonb,
    billing_address jsonb,
    tracking_number text,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: payment_methods; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_methods (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    description text,
    instructions text,
    icon text,
    fee_note text,
    sort_order integer DEFAULT 0 NOT NULL,
    provider_key text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.payment_methods OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    short_description text,
    price numeric(10,2),
    compare_at_price numeric(10,2),
    category_id character varying,
    brand text DEFAULT 'forge'::text NOT NULL,
    image_url text,
    images jsonb DEFAULT '[]'::jsonb,
    stock integer DEFAULT 0 NOT NULL,
    sku text,
    featured boolean DEFAULT false,
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    product_id character varying NOT NULL,
    user_id character varying NOT NULL,
    rating integer NOT NULL,
    title text,
    content text,
    verified boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    email character varying,
    first_name character varying,
    last_name character varying,
    profile_image_url character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: _managed_webhooks; Type: TABLE; Schema: stripe; Owner: postgres
--

CREATE TABLE stripe._managed_webhooks (
    id text NOT NULL,
    object text,
    url text NOT NULL,
    enabled_events jsonb NOT NULL,
    description text,
    enabled boolean,
    livemode boolean,
    metadata jsonb,
    secret text NOT NULL,
    status text,
    api_version text,
    created integer,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_synced_at timestamp with time zone,
    account_id text NOT NULL
);


ALTER TABLE stripe._managed_webhooks OWNER TO postgres;

--
-- Name: _migrations; Type: TABLE; Schema: stripe; Owner: postgres
--

CREATE TABLE stripe._migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE stripe._migrations OWNER TO postgres;

--
-- Name: _sync_status; Type: TABLE; Schema: stripe; Owner: postgres
--

CREATE TABLE stripe._sync_status (
    id integer NOT NULL,
    resource text NOT NULL,
    status text DEFAULT 'idle'::text,
    last_synced_at timestamp with time zone DEFAULT now(),
    last_incremental_cursor timestamp with time zone,
    error_message text,
    updated_at timestamp with time zone DEFAULT now(),
    account_id text NOT NULL,
    CONSTRAINT _sync_status_status_check CHECK ((status = ANY (ARRAY['idle'::text, 'running'::text, 'complete'::text, 'error'::text])))
);


ALTER TABLE stripe._sync_status OWNER TO postgres;

--
-- Name: _sync_status_id_seq; Type: SEQUENCE; Schema: stripe; Owner: postgres
--

CREATE SEQUENCE stripe._sync_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE stripe._sync_status_id_seq OWNER TO postgres;

--
-- Name: _sync_status_id_seq; Type: SEQUENCE OWNED BY; Schema: stripe; Owner: postgres
--

ALTER SEQUENCE stripe._sync_status_id_seq OWNED BY stripe._sync_status.id;


--
-- Name: accounts; Type: TABLE; Schema: stripe; Owner: postgres
--

CREATE TABLE stripe.accounts (
    _raw_data jsonb NOT NULL,
    first_synced_at timestamp with time zone DEFAULT now() NOT NULL,
    _last_synced_at timestamp with time zone DEFAULT now() NOT NULL,
    _updated_at timestamp with time zone DEFAULT now() NOT NULL,
    business_name text GENERATED ALWAYS AS (((_raw_data -> 'business_profile'::text) ->> 'name'::text)) STORED,
    email text GENERATED ALWAYS AS ((_raw_data ->> 'email'::text)) STORED,
    type text GENERATED ALWAYS AS ((_raw_data ->> 'type'::text)) STORED,
    charges_enabled boolean GENERATED ALWAYS AS (((_raw_data ->> 'charges_enabled'::text))::boolean) STORED,
    payouts_enabled boolean GENERATED ALWAYS AS (((_raw_data ->> 'payouts_enabled'::text))::boolean) STORED,
    details_submitted boolean GENERATED ALWAYS AS (((_raw_data ->> 'details_submitted'::text))::boolean) STORED,
    country text GENERATED ALWAYS AS ((_raw_data ->> 'country'::text)) STORED,
    default_currency text GENERATED ALWAYS AS ((_raw_data ->> 'default_currency'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    api_key_hashes text[] DEFAULT '{}'::text[],
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.accounts OWNER TO postgres;

--
-- Name: active_entitlements; Type: TABLE; Schema: stripe; Owner: postgres
--

CREATE TABLE stripe.active_entitlements (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    feature text GENERATED ALWAYS AS ((_raw_data ->> 'feature'::text)) STORED,
    customer text GENERATED ALWAYS AS ((_raw_data ->> 'customer'::text)) STORED,
    lookup_key text GENERATED ALWAYS AS ((_raw_data ->> 'lookup_key'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.active_entitlements OWNER TO postgres;

--
-- Name: charges; Type: TABLE; Schema: stripe; Owner: postgres
--

CREATE TABLE stripe.charges (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    paid boolean GENERATED ALWAYS AS (((_raw_data ->> 'paid'::text))::boolean) STORED,
    "order" text GENERATED ALWAYS AS ((_raw_data ->> 'order'::text)) STORED,
    amount bigint GENERATED ALWAYS AS (((_raw_data ->> 'amount'::text))::bigint) STORED,
    review text GENERATED ALWAYS AS ((_raw_data ->> 'review'::text)) STORED,
    source jsonb GENERATED ALWAYS AS ((_raw_data -> 'source'::text)) STORED,
    status text GENERATED ALWAYS AS ((_raw_data ->> 'status'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    dispute text GENERATED ALWAYS AS ((_raw_data ->> 'dispute'::text)) STORED,
    invoice text GENERATED ALWAYS AS ((_raw_data ->> 'invoice'::text)) STORED,
    outcome jsonb GENERATED ALWAYS AS ((_raw_data -> 'outcome'::text)) STORED,
    refunds jsonb GENERATED ALWAYS AS ((_raw_data -> 'refunds'::text)) STORED,
    updated integer GENERATED ALWAYS AS (((_raw_data ->> 'updated'::text))::integer) STORED,
    captured boolean GENERATED ALWAYS AS (((_raw_data ->> 'captured'::text))::boolean) STORED,
    currency text GENERATED ALWAYS AS ((_raw_data ->> 'currency'::text)) STORED,
    customer text GENERATED ALWAYS AS ((_raw_data ->> 'customer'::text)) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    refunded boolean GENERATED ALWAYS AS (((_raw_data ->> 'refunded'::text))::boolean) STORED,
    shipping jsonb GENERATED ALWAYS AS ((_raw_data -> 'shipping'::text)) STORED,
    application text GENERATED ALWAYS AS ((_raw_data ->> 'application'::text)) STORED,
    description text GENERATED ALWAYS AS ((_raw_data ->> 'description'::text)) STORED,
    destination text GENERATED ALWAYS AS ((_raw_data ->> 'destination'::text)) STORED,
    failure_code text GENERATED ALWAYS AS ((_raw_data ->> 'failure_code'::text)) STORED,
    on_behalf_of text GENERATED ALWAYS AS ((_raw_data ->> 'on_behalf_of'::text)) STORED,
    fraud_details jsonb GENERATED ALWAYS AS ((_raw_data -> 'fraud_details'::text)) STORED,
    receipt_email text GENERATED ALWAYS AS ((_raw_data ->> 'receipt_email'::text)) STORED,
    payment_intent text GENERATED ALWAYS AS ((_raw_data ->> 'payment_intent'::text)) STORED,
    receipt_number text GENERATED ALWAYS AS ((_raw_data ->> 'receipt_number'::text)) STORED,
    transfer_group text GENERATED ALWAYS AS ((_raw_data ->> 'transfer_group'::text)) STORED,
    amount_refunded bigint GENERATED ALWAYS AS (((_raw_data ->> 'amount_refunded'::text))::bigint) STORED,
    application_fee text GENERATED ALWAYS AS ((_raw_data ->> 'application_fee'::text)) STORED,
    failure_message text GENERATED ALWAYS AS ((_raw_data ->> 'failure_message'::text)) STORED,
    source_transfer text GENERATED ALWAYS AS ((_raw_data ->> 'source_transfer'::text)) STORED,
    balance_transaction text GENERATED ALWAYS AS ((_raw_data ->> 'balance_transaction'::text)) STORED,
    statement_descriptor text GENERATED ALWAYS AS ((_raw_data ->> 'statement_descriptor'::text)) STORED,
    payment_method_details jsonb GENERATED ALWAYS AS ((_raw_data -> 'payment_method_details'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.charges OWNER TO postgres;

--
-- Name: checkout_session_line_items; Type: TABLE; Schema: stripe; Owner: postgres
--

CREATE TABLE stripe.checkout_session_line_items (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    amount_discount integer GENERATED ALWAYS AS (((_raw_data ->> 'amount_discount'::text))::integer) STORED,
    amount_subtotal integer GENERATED ALWAYS AS (((_raw_data ->> 'amount_subtotal'::text))::integer) STORED,
    amount_tax integer GENERATED ALWAYS AS (((_raw_data ->> 'amount_tax'::text))::integer) STORED,
    amount_total integer GENERATED ALWAYS AS (((_raw_data ->> 'amount_total'::text))::integer) STORED,
    currency text GENERATED ALWAYS AS ((_raw_data ->> 'currency'::text)) STORED,
    description text GENERATED ALWAYS AS ((_raw_data ->> 'description'::text)) STORED,
    price text GENERATED ALWAYS AS ((_raw_data ->> 'price'::text)) STORED,
    quantity integer GENERATED ALWAYS AS (((_raw_data ->> 'quantity'::text))::integer) STORED,
    checkout_session text GENERATED ALWAYS AS ((_raw_data ->> 'checkout_session'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.checkout_session_line_items OWNER TO postgres;

--
-- Name: checkout_sessions; Type: TABLE; Schema: stripe; Owner: postgres
--

CREATE TABLE stripe.checkout_sessions (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    adaptive_pricing jsonb GENERATED ALWAYS AS ((_raw_data -> 'adaptive_pricing'::text)) STORED,
    after_expiration jsonb GENERATED ALWAYS AS ((_raw_data -> 'after_expiration'::text)) STORED,
    allow_promotion_codes boolean GENERATED ALWAYS AS (((_raw_data ->> 'allow_promotion_codes'::text))::boolean) STORED,
    amount_subtotal integer GENERATED ALWAYS AS (((_raw_data ->> 'amount_subtotal'::text))::integer) STORED,
    amount_total integer GENERATED ALWAYS AS (((_raw_data ->> 'amount_total'::text))::integer) STORED,
    automatic_tax jsonb GENERATED ALWAYS AS ((_raw_data -> 'automatic_tax'::text)) STORED,
    billing_address_collection text GENERATED ALWAYS AS ((_raw_data ->> 'billing_address_collection'::text)) STORED,
    cancel_url text GENERATED ALWAYS AS ((_raw_data ->> 'cancel_url'::text)) STORED,
    client_reference_id text GENERATED ALWAYS AS ((_raw_data ->> 'client_reference_id'::text)) STORED,
    client_secret text GENERATED ALWAYS AS ((_raw_data ->> 'client_secret'::text)) STORED,
    collected_information jsonb GENERATED ALWAYS AS ((_raw_data -> 'collected_information'::text)) STORED,
    consent jsonb GENERATED ALWAYS AS ((_raw_data -> 'consent'::text)) STORED,
    consent_collection jsonb GENERATED ALWAYS AS ((_raw_data -> 'consent_collection'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    currency text GENERATED ALWAYS AS ((_raw_data ->> 'currency'::text)) STORED,
    currency_conversion jsonb GENERATED ALWAYS AS ((_raw_data -> 'currency_conversion'::text)) STORED,
    custom_fields jsonb GENERATED ALWAYS AS ((_raw_data -> 'custom_fields'::text)) STORED,
    custom_text jsonb GENERATED ALWAYS AS ((_raw_data -> 'custom_text'::text)) STORED,
    customer text GENERATED ALWAYS AS ((_raw_data ->> 'customer'::text)) STORED,
    customer_creation text GENERATED ALWAYS AS ((_raw_data ->> 'customer_creation'::text)) STORED,
    customer_details jsonb GENERATED ALWAYS AS ((_raw_data -> 'customer_details'::text)) STORED,
    customer_email text GENERATED ALWAYS AS ((_raw_data ->> 'customer_email'::text)) STORED,
    discounts jsonb GENERATED ALWAYS AS ((_raw_data -> 'discounts'::text)) STORED,
    expires_at integer GENERATED ALWAYS AS (((_raw_data ->> 'expires_at'::text))::integer) STORED,
    invoice text GENERATED ALWAYS AS ((_raw_data ->> 'invoice'::text)) STORED,
    invoice_creation jsonb GENERATED ALWAYS AS ((_raw_data -> 'invoice_creation'::text)) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    locale text GENERATED ALWAYS AS ((_raw_data ->> 'locale'::text)) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    mode text GENERATED ALWAYS AS ((_raw_data ->> 'mode'::text)) STORED,
    optional_items jsonb GENERATED ALWAYS AS ((_raw_data -> 'optional_items'::text)) STORED,
    payment_intent text GENERATED ALWAYS AS ((_raw_data ->> 'payment_intent'::text)) STORED,
    payment_link text GENERATED ALWAYS AS ((_raw_data ->> 'payment_link'::text)) STORED,
    payment_method_collection text GENERATED ALWAYS AS ((_raw_data ->> 'payment_method_collection'::text)) STORED,
    payment_method_configuration_details jsonb GENERATED ALWAYS AS ((_raw_data -> 'payment_method_configuration_details'::text)) STORED,
    payment_method_options jsonb GENERATED ALWAYS AS ((_raw_data -> 'payment_method_options'::text)) STORED,
    payment_method_types jsonb GENERATED ALWAYS AS ((_raw_data -> 'payment_method_types'::text)) STORED,
    payment_status text GENERATED ALWAYS AS ((_raw_data ->> 'payment_status'::text)) STORED,
    permissions jsonb GENERATED ALWAYS AS ((_raw_data -> 'permissions'::text)) STORED,
    phone_number_collection jsonb GENERATED ALWAYS AS ((_raw_data -> 'phone_number_collection'::text)) STORED,
    presentment_details jsonb GENERATED ALWAYS AS ((_raw_data -> 'presentment_details'::text)) STORED,
    recovered_from text GENERATED ALWAYS AS ((_raw_data ->> 'recovered_from'::text)) STORED,
    redirect_on_completion text GENERATED ALWAYS AS ((_raw_data ->> 'redirect_on_completion'::text)) STORED,
    return_url text GENERATED ALWAYS AS ((_raw_data ->> 'return_url'::text)) STORED,
    saved_payment_method_options jsonb GENERATED ALWAYS AS ((_raw_data -> 'saved_payment_method_options'::text)) STORED,
    setup_intent text GENERATED ALWAYS AS ((_raw_data ->> 'setup_intent'::text)) STORED,
    shipping_address_collection jsonb GENERATED ALWAYS AS ((_raw_data -> 'shipping_address_collection'::text)) STORED,
    shipping_cost jsonb GENERATED ALWAYS AS ((_raw_data -> 'shipping_cost'::text)) STORED,
    shipping_details jsonb GENERATED ALWAYS AS ((_raw_data -> 'shipping_details'::text)) STORED,
    shipping_options jsonb GENERATED ALWAYS AS ((_raw_data -> 'shipping_options'::text)) STORED,
    status text GENERATED ALWAYS AS ((_raw_data ->> 'status'::text)) STORED,
    submit_type text GENERATED ALWAYS AS ((_raw_data ->> 'submit_type'::text)) STORED,
    subscription text GENERATED ALWAYS AS ((_raw_data ->> 'subscription'::text)) STORED,
    success_url text GENERATED ALWAYS AS ((_raw_data ->> 'success_url'::text)) STORED,
    tax_id_collection jsonb GENERATED ALWAYS AS ((_raw_data -> 'tax_id_collection'::text)) STORED,
    total_details jsonb GENERATED ALWAYS AS ((_raw_data -> 'total_details'::text)) STORED,
    ui_mode text GENERATED ALWAYS AS ((_raw_data ->> 'ui_mode'::text)) STORED,
    url text GENERATED ALWAYS AS ((_raw_data ->> 'url'::text)) STORED,
    wallet_options jsonb GENERATED ALWAYS AS ((_raw_data -> 'wallet_options'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.checkout_sessions OWNER TO postgres;

--
-- Name: coupons; Type: TABLE; Schema: stripe; Owner: postgres
--

CREATE TABLE stripe.coupons (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    name text GENERATED ALWAYS AS ((_raw_data ->> 'name'::text)) STORED,
    valid boolean GENERATED ALWAYS AS (((_raw_data ->> 'valid'::text))::boolean) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    updated integer GENERATED ALWAYS AS (((_raw_data ->> 'updated'::text))::integer) STORED,
    currency text GENERATED ALWAYS AS ((_raw_data ->> 'currency'::text)) STORED,
    duration text GENERATED ALWAYS AS ((_raw_data ->> 'duration'::text)) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    redeem_by integer GENERATED ALWAYS AS (((_raw_data ->> 'redeem_by'::text))::integer) STORED,
    amount_off bigint GENERATED ALWAYS AS (((_raw_data ->> 'amount_off'::text))::bigint) STORED,
    percent_off double precision GENERATED ALWAYS AS (((_raw_data ->> 'percent_off'::text))::double precision) STORED,
    times_redeemed bigint GENERATED ALWAYS AS (((_raw_data ->> 'times_redeemed'::text))::bigint) STORED,
    max_redemptions bigint GENERATED ALWAYS AS (((_raw_data ->> 'max_redemptions'::text))::bigint) STORED,
    duration_in_months bigint GENERATED ALWAYS AS (((_raw_data ->> 'duration_in_months'::text))::bigint) STORED,
    percent_off_precise double precision GENERATED ALWAYS AS (((_raw_data ->> 'percent_off_precise'::text))::double precision) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.coupons OWNER TO postgres;

--
-- Name: credit_notes; Type: TABLE; Schema: stripe; Owner: postgres
--

CREATE TABLE stripe.credit_notes (
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    amount integer GENERATED ALWAYS AS (((_raw_data ->> 'amount'::text))::integer) STORED,
    amount_shipping integer GENERATED ALWAYS AS (((_raw_data ->> 'amount_shipping'::text))::integer) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    currency text GENERATED ALWAYS AS ((_raw_data ->> 'currency'::text)) STORED,
    customer text GENERATED ALWAYS AS ((_raw_data ->> 'customer'::text)) STORED,
    customer_balance_transaction text GENERATED ALWAYS AS ((_raw_data ->> 'customer_balance_transaction'::text)) STORED,
    discount_amount integer GENERATED ALWAYS AS (((_raw_data ->> 'discount_amount'::text))::integer) STORED,
    discount_amounts jsonb GENERATED ALWAYS AS ((_raw_data -> 'discount_amounts'::text)) STORED,
    invoice text GENERATED ALWAYS AS ((_raw_data ->> 'invoice'::text)) STORED,
    lines jsonb GENERATED ALWAYS AS ((_raw_data -> 'lines'::text)) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    memo text GENERATED ALWAYS AS ((_raw_data ->> 'memo'::text)) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    number text GENERATED ALWAYS AS ((_raw_data ->> 'number'::text)) STORED,
    out_of_band_amount integer GENERATED ALWAYS AS (((_raw_data ->> 'out_of_band_amount'::text))::integer) STORED,
    pdf text GENERATED ALWAYS AS ((_raw_data ->> 'pdf'::text)) STORED,
    reason text GENERATED ALWAYS AS ((_raw_data ->> 'reason'::text)) STORED,
    refund text GENERATED ALWAYS AS ((_raw_data ->> 'refund'::text)) STORED,
    shipping_cost jsonb GENERATED ALWAYS AS ((_raw_data -> 'shipping_cost'::text)) STORED,
    status text GENERATED ALWAYS AS ((_raw_data ->> 'status'::text)) STORED,
    subtotal integer GENERATED ALWAYS AS (((_raw_data ->> 'subtotal'::text))::integer) STORED,
    subtotal_excluding_tax integer GENERATED ALWAYS AS (((_raw_data ->> 'subtotal_excluding_tax'::text))::integer) STORED,
    tax_amounts jsonb GENERATED ALWAYS AS ((_raw_data -> 'tax_amounts'::text)) STORED,
    total integer GENERATED ALWAYS AS (((_raw_data ->> 'total'::text))::integer) STORED,
    total_excluding_tax integer GENERATED ALWAYS AS (((_raw_data ->> 'total_excluding_tax'::text))::integer) STORED,
    type text GENERATED ALWAYS AS ((_raw_data ->> 'type'::text)) STORED,
    voided_at text GENERATED ALWAYS AS ((_raw_data ->> 'voided_at'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.credit_notes OWNER TO postgres;

--
-- Name: customers; Type: TABLE; Schema: stripe; Owner: postgres
--

CREATE TABLE stripe.customers (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    address jsonb GENERATED ALWAYS AS ((_raw_data -> 'address'::text)) STORED,
    description text GENERATED ALWAYS AS ((_raw_data ->> 'description'::text)) STORED,
    email text GENERATED ALWAYS AS ((_raw_data ->> 'email'::text)) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    name text GENERATED ALWAYS AS ((_raw_data ->> 'name'::text)) STORED,
    phone text GENERATED ALWAYS AS ((_raw_data ->> 'phone'::text)) STORED,
    shipping jsonb GENERATED ALWAYS AS ((_raw_data -> 'shipping'::text)) STORED,
    balance integer GENERATED ALWAYS AS (((_raw_data ->> 'balance'::text))::integer) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    currency text GENERATED ALWAYS AS ((_raw_data ->> 'currency'::text)) STORED,
    default_source text GENERATED ALWAYS AS ((_raw_data ->> 'default_source'::text)) STORED,
    delinquent boolean GENERATED ALWAYS AS (((_raw_data ->> 'delinquent'::text))::boolean) STORED,
    discount jsonb GENERATED ALWAYS AS ((_raw_data -> 'discount'::text)) STORED,
    invoice_prefix text GENERATED ALWAYS AS ((_raw_data ->> 'invoice_prefix'::text)) STORED,
    invoice_settings jsonb GENERATED ALWAYS AS ((_raw_data -> 'invoice_settings'::text)) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    next_invoice_sequence integer GENERATED ALWAYS AS (((_raw_data ->> 'next_invoice_sequence'::text))::integer) STORED,
    preferred_locales jsonb GENERATED ALWAYS AS ((_raw_data -> 'preferred_locales'::text)) STORED,
    tax_exempt text GENERATED ALWAYS AS ((_raw_data ->> 'tax_exempt'::text)) STORED,
    deleted boolean GENERATED ALWAYS AS (((_raw_data ->> 'deleted'::text))::boolean) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.customers OWNER TO postgres;

--
-- Name: disputes; Type: TABLE; Schema: stripe; Owner: postgres
--

CREATE TABLE stripe.disputes (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    amount bigint GENERATED ALWAYS AS (((_raw_data ->> 'amount'::text))::bigint) STORED,
    charge text GENERATED ALWAYS AS ((_raw_data ->> 'charge'::text)) STORED,
    reason text GENERATED ALWAYS AS ((_raw_data ->> 'reason'::text)) STORED,
    status text GENERATED ALWAYS AS ((_raw_data ->> 'status'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    updated integer GENERATED ALWAYS AS (((_raw_data ->> 'updated'::text))::integer) STORED,
    currency text GENERATED ALWAYS AS ((_raw_data ->> 'currency'::text)) STORED,
    evidence jsonb GENERATED ALWAYS AS ((_raw_data -> 'evidence'::text)) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    evidence_details jsonb GENERATED ALWAYS AS ((_raw_data -> 'evidence_details'::text)) STORED,
    balance_transactions jsonb GENERATED ALWAYS AS ((_raw_data -> 'balance_transactions'::text)) STORED,
    is_charge_refundable boolean GENERATED ALWAYS AS (((_raw_data ->> 'is_charge_refundable'::text))::boolean) STORED,
    payment_intent text GENERATED ALWAYS AS ((_raw_data ->> 'payment_intent'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.disputes OWNER TO postgres;

--
-- Name: early_fraud_warnings; Type: TABLE; Schema: stripe; Owner: postgres
--

CREATE TABLE stripe.early_fraud_warnings (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    actionable boolean GENERATED ALWAYS AS (((_raw_data ->> 'actionable'::text))::boolean) STORED,
    charge text GENERATED ALWAYS AS ((_raw_data ->> 'charge'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    fraud_type text GENERATED ALWAYS AS ((_raw_data ->> 'fraud_type'::text)) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    payment_intent text GENERATED ALWAYS AS ((_raw_data ->> 'payment_intent'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.early_fraud_warnings OWNER TO postgres;

--
-- Name: events; Type: TABLE; Schema: stripe; Owner: postgres
--

CREATE TABLE stripe.events (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    data jsonb GENERATED ALWAYS AS ((_raw_data -> 'data'::text)) STORED,
    type text GENERATED ALWAYS AS ((_raw_data ->> 'type'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    request text GENERATED ALWAYS AS ((_raw_data ->> 'request'::text)) STORED,
    updated integer GENERATED ALWAYS AS (((_raw_data ->> 'updated'::text))::integer) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    api_version text GENERATED ALWAYS AS ((_raw_data ->> 'api_version'::text)) STORED,
    pending_webhooks bigint GENERATED ALWAYS AS (((_raw_data ->> 'pending_webhooks'::text))::bigint) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.events OWNER TO postgres;

--
-- Name: features; Type: TABLE; Schema: stripe; Owner: postgres
--

CREATE TABLE stripe.features (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    name text GENERATED ALWAYS AS ((_raw_data ->> 'name'::text)) STORED,
    lookup_key text GENERATED ALWAYS AS ((_raw_data ->> 'lookup_key'::text)) STORED,
    active boolean GENERATED ALWAYS AS (((_raw_data ->> 'active'::text))::boolean) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.features OWNER TO postgres;

--
-- Name: invoices; Type: TABLE; Schema: stripe; Owner: postgres
--

CREATE TABLE stripe.invoices (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    auto_advance boolean GENERATED ALWAYS AS (((_raw_data ->> 'auto_advance'::text))::boolean) STORED,
    collection_method text GENERATED ALWAYS AS ((_raw_data ->> 'collection_method'::text)) STORED,
    currency text GENERATED ALWAYS AS ((_raw_data ->> 'currency'::text)) STORED,
    description text GENERATED ALWAYS AS ((_raw_data ->> 'description'::text)) STORED,
    hosted_invoice_url text GENERATED ALWAYS AS ((_raw_data ->> 'hosted_invoice_url'::text)) STORED,
    lines jsonb GENERATED ALWAYS AS ((_raw_data -> 'lines'::text)) STORED,
    period_end integer GENERATED ALWAYS AS (((_raw_data ->> 'period_end'::text))::integer) STORED,
    period_start integer GENERATED ALWAYS AS (((_raw_data ->> 'period_start'::text))::integer) STORED,
    status text GENERATED ALWAYS AS ((_raw_data ->> 'status'::text)) STORED,
    total bigint GENERATED ALWAYS AS (((_raw_data ->> 'total'::text))::bigint) STORED,
    account_country text GENERATED ALWAYS AS ((_raw_data ->> 'account_country'::text)) STORED,
    account_name text GENERATED ALWAYS AS ((_raw_data ->> 'account_name'::text)) STORED,
    account_tax_ids jsonb GENERATED ALWAYS AS ((_raw_data -> 'account_tax_ids'::text)) STORED,
    amount_due bigint GENERATED ALWAYS AS (((_raw_data ->> 'amount_due'::text))::bigint) STORED,
    amount_paid bigint GENERATED ALWAYS AS (((_raw_data ->> 'amount_paid'::text))::bigint) STORED,
    amount_remaining bigint GENERATED ALWAYS AS (((_raw_data ->> 'amount_remaining'::text))::bigint) STORED,
    application_fee_amount bigint GENERATED ALWAYS AS (((_raw_data ->> 'application_fee_amount'::text))::bigint) STORED,
    attempt_count integer GENERATED ALWAYS AS (((_raw_data ->> 'attempt_count'::text))::integer) STORED,
    attempted boolean GENERATED ALWAYS AS (((_raw_data ->> 'attempted'::text))::boolean) STORED,
    billing_reason text GENERATED ALWAYS AS ((_raw_data ->> 'billing_reason'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    custom_fields jsonb GENERATED ALWAYS AS ((_raw_data -> 'custom_fields'::text)) STORED,
    customer_address jsonb GENERATED ALWAYS AS ((_raw_data -> 'customer_address'::text)) STORED,
    customer_email text GENERATED ALWAYS AS ((_raw_data ->> 'customer_email'::text)) STORED,
    customer_name text GENERATED ALWAYS AS ((_raw_data ->> 'customer_name'::text)) STORED,
    customer_phone text GENERATED ALWAYS AS ((_raw_data ->> 'customer_phone'::text)) STORED,
    customer_shipping jsonb GENERATED ALWAYS AS ((_raw_data -> 'customer_shipping'::text)) STORED,
    customer_tax_exempt text GENERATED ALWAYS AS ((_raw_data ->> 'customer_tax_exempt'::text)) STORED,
    customer_tax_ids jsonb GENERATED ALWAYS AS ((_raw_data -> 'customer_tax_ids'::text)) STORED,
    default_tax_rates jsonb GENERATED ALWAYS AS ((_raw_data -> 'default_tax_rates'::text)) STORED,
    discount jsonb GENERATED ALWAYS AS ((_raw_data -> 'discount'::text)) STORED,
    discounts jsonb GENERATED ALWAYS AS ((_raw_data -> 'discounts'::text)) STORED,
    due_date integer GENERATED ALWAYS AS (((_raw_data ->> 'due_date'::text))::integer) STORED,
    ending_balance integer GENERATED ALWAYS AS (((_raw_data ->> 'ending_balance'::text))::integer) STORED,
    footer text GENERATED ALWAYS AS ((_raw_data ->> 'footer'::text)) STORED,
    invoice_pdf text GENERATED ALWAYS AS ((_raw_data ->> 'invoice_pdf'::text)) STORED,
    last_finalization_error jsonb GENERATED ALWAYS AS ((_raw_data -> 'last_finalization_error'::text)) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    next_payment_attempt integer GENERATED ALWAYS AS (((_raw_data ->> 'next_payment_attempt'::text))::integer) STORED,
    number text GENERATED ALWAYS AS ((_raw_data ->> 'number'::text)) STORED,
    paid boolean GENERATED ALWAYS AS (((_raw_data ->> 'paid'::text))::boolean) STORED,
    payment_settings jsonb GENERATED ALWAYS AS ((_raw_data -> 'payment_settings'::text)) STORED,
    post_payment_credit_notes_amount integer GENERATED ALWAYS AS (((_raw_data ->> 'post_payment_credit_notes_amount'::text))::integer) STORED,
    pre_payment_credit_notes_amount integer GENERATED ALWAYS AS (((_raw_data ->> 'pre_payment_credit_notes_amount'::text))::integer) STORED,
    receipt_number text GENERATED ALWAYS AS ((_raw_data ->> 'receipt_number'::text)) STORED,
    starting_balance integer GENERATED ALWAYS AS (((_raw_data ->> 'starting_balance'::text))::integer) STORED,
    statement_descriptor text GENERATED ALWAYS AS ((_raw_data ->> 'statement_descriptor'::text)) STORED,
    status_transitions jsonb GENERATED ALWAYS AS ((_raw_data -> 'status_transitions'::text)) STORED,
    subtotal integer GENERATED ALWAYS AS (((_raw_data ->> 'subtotal'::text))::integer) STORED,
    tax integer GENERATED ALWAYS AS (((_raw_data ->> 'tax'::text))::integer) STORED,
    total_discount_amounts jsonb GENERATED ALWAYS AS ((_raw_data -> 'total_discount_amounts'::text)) STORED,
    total_tax_amounts jsonb GENERATED ALWAYS AS ((_raw_data -> 'total_tax_amounts'::text)) STORED,
    transfer_data jsonb GENERATED ALWAYS AS ((_raw_data -> 'transfer_data'::text)) STORED,
    webhooks_delivered_at integer GENERATED ALWAYS AS (((_raw_data ->> 'webhooks_delivered_at'::text))::integer) STORED,
    customer text GENERATED ALWAYS AS ((_raw_data ->> 'customer'::text)) STORED,
    subscription text GENERATED ALWAYS AS ((_raw_data ->> 'subscription'::text)) STORED,
    payment_intent text GENERATED ALWAYS AS ((_raw_data ->> 'payment_intent'::text)) STORED,
    default_payment_method text GENERATED ALWAYS AS ((_raw_data ->> 'default_payment_method'::text)) STORED,
    default_source text GENERATED ALWAYS AS ((_raw_data ->> 'default_source'::text)) STORED,
    on_behalf_of text GENERATED ALWAYS AS ((_raw_data ->> 'on_behalf_of'::text)) STORED,
    charge text GENERATED ALWAYS AS ((_raw_data ->> 'charge'::text)) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.invoices OWNER TO postgres;

--
-- Name: payment_intents; Type: TABLE; Schema: stripe; Owner: postgres
--

CREATE TABLE stripe.payment_intents (
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    amount integer GENERATED ALWAYS AS (((_raw_data ->> 'amount'::text))::integer) STORED,
    amount_capturable integer GENERATED ALWAYS AS (((_raw_data ->> 'amount_capturable'::text))::integer) STORED,
    amount_details jsonb GENERATED ALWAYS AS ((_raw_data -> 'amount_details'::text)) STORED,
    amount_received integer GENERATED ALWAYS AS (((_raw_data ->> 'amount_received'::text))::integer) STORED,
    application text GENERATED ALWAYS AS ((_raw_data ->> 'application'::text)) STORED,
    application_fee_amount integer GENERATED ALWAYS AS (((_raw_data ->> 'application_fee_amount'::text))::integer) STORED,
    automatic_payment_methods text GENERATED ALWAYS AS ((_raw_data ->> 'automatic_payment_methods'::text)) STORED,
    canceled_at integer GENERATED ALWAYS AS (((_raw_data ->> 'canceled_at'::text))::integer) STORED,
    cancellation_reason text GENERATED ALWAYS AS ((_raw_data ->> 'cancellation_reason'::text)) STORED,
    capture_method text GENERATED ALWAYS AS ((_raw_data ->> 'capture_method'::text)) STORED,
    client_secret text GENERATED ALWAYS AS ((_raw_data ->> 'client_secret'::text)) STORED,
    confirmation_method text GENERATED ALWAYS AS ((_raw_data ->> 'confirmation_method'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    currency text GENERATED ALWAYS AS ((_raw_data ->> 'currency'::text)) STORED,
    customer text GENERATED ALWAYS AS ((_raw_data ->> 'customer'::text)) STORED,
    description text GENERATED ALWAYS AS ((_raw_data ->> 'description'::text)) STORED,
    invoice text GENERATED ALWAYS AS ((_raw_data ->> 'invoice'::text)) STORED,
    last_payment_error text GENERATED ALWAYS AS ((_raw_data ->> 'last_payment_error'::text)) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    next_action text GENERATED ALWAYS AS ((_raw_data ->> 'next_action'::text)) STORED,
    on_behalf_of text GENERATED ALWAYS AS ((_raw_data ->> 'on_behalf_of'::text)) STORED,
    payment_method text GENERATED ALWAYS AS ((_raw_data ->> 'payment_method'::text)) STORED,
    payment_method_options jsonb GENERATED ALWAYS AS ((_raw_data -> 'payment_method_options'::text)) STORED,
    payment_method_types jsonb GENERATED ALWAYS AS ((_raw_data -> 'payment_method_types'::text)) STORED,
    processing text GENERATED ALWAYS AS ((_raw_data ->> 'processing'::text)) STORED,
    receipt_email text GENERATED ALWAYS AS ((_raw_data ->> 'receipt_email'::text)) STORED,
    review text GENERATED ALWAYS AS ((_raw_data ->> 'review'::text)) STORED,
    setup_future_usage text GENERATED ALWAYS AS ((_raw_data ->> 'setup_future_usage'::text)) STORED,
    shipping jsonb GENERATED ALWAYS AS ((_raw_data -> 'shipping'::text)) STORED,
    statement_descriptor text GENERATED ALWAYS AS ((_raw_data ->> 'statement_descriptor'::text)) STORED,
    statement_descriptor_suffix text GENERATED ALWAYS AS ((_raw_data ->> 'statement_descriptor_suffix'::text)) STORED,
    status text GENERATED ALWAYS AS ((_raw_data ->> 'status'::text)) STORED,
    transfer_data jsonb GENERATED ALWAYS AS ((_raw_data -> 'transfer_data'::text)) STORED,
    transfer_group text GENERATED ALWAYS AS ((_raw_data ->> 'transfer_group'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.payment_intents OWNER TO postgres;

--
-- Name: payment_methods; Type: TABLE; Schema: stripe; Owner: postgres
--

CREATE TABLE stripe.payment_methods (
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    customer text GENERATED ALWAYS AS ((_raw_data ->> 'customer'::text)) STORED,
    type text GENERATED ALWAYS AS ((_raw_data ->> 'type'::text)) STORED,
    billing_details jsonb GENERATED ALWAYS AS ((_raw_data -> 'billing_details'::text)) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    card jsonb GENERATED ALWAYS AS ((_raw_data -> 'card'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.payment_methods OWNER TO postgres;

--
-- Name: payouts; Type: TABLE; Schema: stripe; Owner: postgres
--

CREATE TABLE stripe.payouts (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    date text GENERATED ALWAYS AS ((_raw_data ->> 'date'::text)) STORED,
    type text GENERATED ALWAYS AS ((_raw_data ->> 'type'::text)) STORED,
    amount bigint GENERATED ALWAYS AS (((_raw_data ->> 'amount'::text))::bigint) STORED,
    method text GENERATED ALWAYS AS ((_raw_data ->> 'method'::text)) STORED,
    status text GENERATED ALWAYS AS ((_raw_data ->> 'status'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    updated integer GENERATED ALWAYS AS (((_raw_data ->> 'updated'::text))::integer) STORED,
    currency text GENERATED ALWAYS AS ((_raw_data ->> 'currency'::text)) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    automatic boolean GENERATED ALWAYS AS (((_raw_data ->> 'automatic'::text))::boolean) STORED,
    recipient text GENERATED ALWAYS AS ((_raw_data ->> 'recipient'::text)) STORED,
    description text GENERATED ALWAYS AS ((_raw_data ->> 'description'::text)) STORED,
    destination text GENERATED ALWAYS AS ((_raw_data ->> 'destination'::text)) STORED,
    source_type text GENERATED ALWAYS AS ((_raw_data ->> 'source_type'::text)) STORED,
    arrival_date text GENERATED ALWAYS AS ((_raw_data ->> 'arrival_date'::text)) STORED,
    bank_account jsonb GENERATED ALWAYS AS ((_raw_data -> 'bank_account'::text)) STORED,
    failure_code text GENERATED ALWAYS AS ((_raw_data ->> 'failure_code'::text)) STORED,
    transfer_group text GENERATED ALWAYS AS ((_raw_data ->> 'transfer_group'::text)) STORED,
    amount_reversed bigint GENERATED ALWAYS AS (((_raw_data ->> 'amount_reversed'::text))::bigint) STORED,
    failure_message text GENERATED ALWAYS AS ((_raw_data ->> 'failure_message'::text)) STORED,
    source_transaction text GENERATED ALWAYS AS ((_raw_data ->> 'source_transaction'::text)) STORED,
    balance_transaction text GENERATED ALWAYS AS ((_raw_data ->> 'balance_transaction'::text)) STORED,
    statement_descriptor text GENERATED ALWAYS AS ((_raw_data ->> 'statement_descriptor'::text)) STORED,
    statement_description text GENERATED ALWAYS AS ((_raw_data ->> 'statement_description'::text)) STORED,
    failure_balance_transaction text GENERATED ALWAYS AS ((_raw_data ->> 'failure_balance_transaction'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.payouts OWNER TO postgres;

--
-- Name: plans; Type: TABLE; Schema: stripe; Owner: postgres
--

CREATE TABLE stripe.plans (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    name text GENERATED ALWAYS AS ((_raw_data ->> 'name'::text)) STORED,
    tiers jsonb GENERATED ALWAYS AS ((_raw_data -> 'tiers'::text)) STORED,
    active boolean GENERATED ALWAYS AS (((_raw_data ->> 'active'::text))::boolean) STORED,
    amount bigint GENERATED ALWAYS AS (((_raw_data ->> 'amount'::text))::bigint) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    product text GENERATED ALWAYS AS ((_raw_data ->> 'product'::text)) STORED,
    updated integer GENERATED ALWAYS AS (((_raw_data ->> 'updated'::text))::integer) STORED,
    currency text GENERATED ALWAYS AS ((_raw_data ->> 'currency'::text)) STORED,
    "interval" text GENERATED ALWAYS AS ((_raw_data ->> 'interval'::text)) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    nickname text GENERATED ALWAYS AS ((_raw_data ->> 'nickname'::text)) STORED,
    tiers_mode text GENERATED ALWAYS AS ((_raw_data ->> 'tiers_mode'::text)) STORED,
    usage_type text GENERATED ALWAYS AS ((_raw_data ->> 'usage_type'::text)) STORED,
    billing_scheme text GENERATED ALWAYS AS ((_raw_data ->> 'billing_scheme'::text)) STORED,
    interval_count bigint GENERATED ALWAYS AS (((_raw_data ->> 'interval_count'::text))::bigint) STORED,
    aggregate_usage text GENERATED ALWAYS AS ((_raw_data ->> 'aggregate_usage'::text)) STORED,
    transform_usage text GENERATED ALWAYS AS ((_raw_data ->> 'transform_usage'::text)) STORED,
    trial_period_days bigint GENERATED ALWAYS AS (((_raw_data ->> 'trial_period_days'::text))::bigint) STORED,
    statement_descriptor text GENERATED ALWAYS AS ((_raw_data ->> 'statement_descriptor'::text)) STORED,
    statement_description text GENERATED ALWAYS AS ((_raw_data ->> 'statement_description'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.plans OWNER TO postgres;

--
-- Name: prices; Type: TABLE; Schema: stripe; Owner: postgres
--

CREATE TABLE stripe.prices (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    active boolean GENERATED ALWAYS AS (((_raw_data ->> 'active'::text))::boolean) STORED,
    currency text GENERATED ALWAYS AS ((_raw_data ->> 'currency'::text)) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    nickname text GENERATED ALWAYS AS ((_raw_data ->> 'nickname'::text)) STORED,
    recurring jsonb GENERATED ALWAYS AS ((_raw_data -> 'recurring'::text)) STORED,
    type text GENERATED ALWAYS AS ((_raw_data ->> 'type'::text)) STORED,
    unit_amount integer GENERATED ALWAYS AS (((_raw_data ->> 'unit_amount'::text))::integer) STORED,
    billing_scheme text GENERATED ALWAYS AS ((_raw_data ->> 'billing_scheme'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    lookup_key text GENERATED ALWAYS AS ((_raw_data ->> 'lookup_key'::text)) STORED,
    tiers_mode text GENERATED ALWAYS AS ((_raw_data ->> 'tiers_mode'::text)) STORED,
    transform_quantity jsonb GENERATED ALWAYS AS ((_raw_data -> 'transform_quantity'::text)) STORED,
    unit_amount_decimal text GENERATED ALWAYS AS ((_raw_data ->> 'unit_amount_decimal'::text)) STORED,
    product text GENERATED ALWAYS AS ((_raw_data ->> 'product'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.prices OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: stripe; Owner: postgres
--

CREATE TABLE stripe.products (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    active boolean GENERATED ALWAYS AS (((_raw_data ->> 'active'::text))::boolean) STORED,
    default_price text GENERATED ALWAYS AS ((_raw_data ->> 'default_price'::text)) STORED,
    description text GENERATED ALWAYS AS ((_raw_data ->> 'description'::text)) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    name text GENERATED ALWAYS AS ((_raw_data ->> 'name'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    images jsonb GENERATED ALWAYS AS ((_raw_data -> 'images'::text)) STORED,
    marketing_features jsonb GENERATED ALWAYS AS ((_raw_data -> 'marketing_features'::text)) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    package_dimensions jsonb GENERATED ALWAYS AS ((_raw_data -> 'package_dimensions'::text)) STORED,
    shippable boolean GENERATED ALWAYS AS (((_raw_data ->> 'shippable'::text))::boolean) STORED,
    statement_descriptor text GENERATED ALWAYS AS ((_raw_data ->> 'statement_descriptor'::text)) STORED,
    unit_label text GENERATED ALWAYS AS ((_raw_data ->> 'unit_label'::text)) STORED,
    updated integer GENERATED ALWAYS AS (((_raw_data ->> 'updated'::text))::integer) STORED,
    url text GENERATED ALWAYS AS ((_raw_data ->> 'url'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.products OWNER TO postgres;

--
-- Name: refunds; Type: TABLE; Schema: stripe; Owner: postgres
--

CREATE TABLE stripe.refunds (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    amount integer GENERATED ALWAYS AS (((_raw_data ->> 'amount'::text))::integer) STORED,
    balance_transaction text GENERATED ALWAYS AS ((_raw_data ->> 'balance_transaction'::text)) STORED,
    charge text GENERATED ALWAYS AS ((_raw_data ->> 'charge'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    currency text GENERATED ALWAYS AS ((_raw_data ->> 'currency'::text)) STORED,
    destination_details jsonb GENERATED ALWAYS AS ((_raw_data -> 'destination_details'::text)) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    payment_intent text GENERATED ALWAYS AS ((_raw_data ->> 'payment_intent'::text)) STORED,
    reason text GENERATED ALWAYS AS ((_raw_data ->> 'reason'::text)) STORED,
    receipt_number text GENERATED ALWAYS AS ((_raw_data ->> 'receipt_number'::text)) STORED,
    source_transfer_reversal text GENERATED ALWAYS AS ((_raw_data ->> 'source_transfer_reversal'::text)) STORED,
    status text GENERATED ALWAYS AS ((_raw_data ->> 'status'::text)) STORED,
    transfer_reversal text GENERATED ALWAYS AS ((_raw_data ->> 'transfer_reversal'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.refunds OWNER TO postgres;

--
-- Name: reviews; Type: TABLE; Schema: stripe; Owner: postgres
--

CREATE TABLE stripe.reviews (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    billing_zip text GENERATED ALWAYS AS ((_raw_data ->> 'billing_zip'::text)) STORED,
    charge text GENERATED ALWAYS AS ((_raw_data ->> 'charge'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    closed_reason text GENERATED ALWAYS AS ((_raw_data ->> 'closed_reason'::text)) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    ip_address text GENERATED ALWAYS AS ((_raw_data ->> 'ip_address'::text)) STORED,
    ip_address_location jsonb GENERATED ALWAYS AS ((_raw_data -> 'ip_address_location'::text)) STORED,
    open boolean GENERATED ALWAYS AS (((_raw_data ->> 'open'::text))::boolean) STORED,
    opened_reason text GENERATED ALWAYS AS ((_raw_data ->> 'opened_reason'::text)) STORED,
    payment_intent text GENERATED ALWAYS AS ((_raw_data ->> 'payment_intent'::text)) STORED,
    reason text GENERATED ALWAYS AS ((_raw_data ->> 'reason'::text)) STORED,
    session text GENERATED ALWAYS AS ((_raw_data ->> 'session'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.reviews OWNER TO postgres;

--
-- Name: setup_intents; Type: TABLE; Schema: stripe; Owner: postgres
--

CREATE TABLE stripe.setup_intents (
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    customer text GENERATED ALWAYS AS ((_raw_data ->> 'customer'::text)) STORED,
    description text GENERATED ALWAYS AS ((_raw_data ->> 'description'::text)) STORED,
    payment_method text GENERATED ALWAYS AS ((_raw_data ->> 'payment_method'::text)) STORED,
    status text GENERATED ALWAYS AS ((_raw_data ->> 'status'::text)) STORED,
    usage text GENERATED ALWAYS AS ((_raw_data ->> 'usage'::text)) STORED,
    cancellation_reason text GENERATED ALWAYS AS ((_raw_data ->> 'cancellation_reason'::text)) STORED,
    latest_attempt text GENERATED ALWAYS AS ((_raw_data ->> 'latest_attempt'::text)) STORED,
    mandate text GENERATED ALWAYS AS ((_raw_data ->> 'mandate'::text)) STORED,
    single_use_mandate text GENERATED ALWAYS AS ((_raw_data ->> 'single_use_mandate'::text)) STORED,
    on_behalf_of text GENERATED ALWAYS AS ((_raw_data ->> 'on_behalf_of'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.setup_intents OWNER TO postgres;

--
-- Name: subscription_items; Type: TABLE; Schema: stripe; Owner: postgres
--

CREATE TABLE stripe.subscription_items (
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    billing_thresholds jsonb GENERATED ALWAYS AS ((_raw_data -> 'billing_thresholds'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    deleted boolean GENERATED ALWAYS AS (((_raw_data ->> 'deleted'::text))::boolean) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    quantity integer GENERATED ALWAYS AS (((_raw_data ->> 'quantity'::text))::integer) STORED,
    price text GENERATED ALWAYS AS ((_raw_data ->> 'price'::text)) STORED,
    subscription text GENERATED ALWAYS AS ((_raw_data ->> 'subscription'::text)) STORED,
    tax_rates jsonb GENERATED ALWAYS AS ((_raw_data -> 'tax_rates'::text)) STORED,
    current_period_end integer GENERATED ALWAYS AS (((_raw_data ->> 'current_period_end'::text))::integer) STORED,
    current_period_start integer GENERATED ALWAYS AS (((_raw_data ->> 'current_period_start'::text))::integer) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.subscription_items OWNER TO postgres;

--
-- Name: subscription_schedules; Type: TABLE; Schema: stripe; Owner: postgres
--

CREATE TABLE stripe.subscription_schedules (
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    application text GENERATED ALWAYS AS ((_raw_data ->> 'application'::text)) STORED,
    canceled_at integer GENERATED ALWAYS AS (((_raw_data ->> 'canceled_at'::text))::integer) STORED,
    completed_at integer GENERATED ALWAYS AS (((_raw_data ->> 'completed_at'::text))::integer) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    current_phase jsonb GENERATED ALWAYS AS ((_raw_data -> 'current_phase'::text)) STORED,
    customer text GENERATED ALWAYS AS ((_raw_data ->> 'customer'::text)) STORED,
    default_settings jsonb GENERATED ALWAYS AS ((_raw_data -> 'default_settings'::text)) STORED,
    end_behavior text GENERATED ALWAYS AS ((_raw_data ->> 'end_behavior'::text)) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    phases jsonb GENERATED ALWAYS AS ((_raw_data -> 'phases'::text)) STORED,
    released_at integer GENERATED ALWAYS AS (((_raw_data ->> 'released_at'::text))::integer) STORED,
    released_subscription text GENERATED ALWAYS AS ((_raw_data ->> 'released_subscription'::text)) STORED,
    status text GENERATED ALWAYS AS ((_raw_data ->> 'status'::text)) STORED,
    subscription text GENERATED ALWAYS AS ((_raw_data ->> 'subscription'::text)) STORED,
    test_clock text GENERATED ALWAYS AS ((_raw_data ->> 'test_clock'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.subscription_schedules OWNER TO postgres;

--
-- Name: subscriptions; Type: TABLE; Schema: stripe; Owner: postgres
--

CREATE TABLE stripe.subscriptions (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    cancel_at_period_end boolean GENERATED ALWAYS AS (((_raw_data ->> 'cancel_at_period_end'::text))::boolean) STORED,
    current_period_end integer GENERATED ALWAYS AS (((_raw_data ->> 'current_period_end'::text))::integer) STORED,
    current_period_start integer GENERATED ALWAYS AS (((_raw_data ->> 'current_period_start'::text))::integer) STORED,
    default_payment_method text GENERATED ALWAYS AS ((_raw_data ->> 'default_payment_method'::text)) STORED,
    items jsonb GENERATED ALWAYS AS ((_raw_data -> 'items'::text)) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    pending_setup_intent text GENERATED ALWAYS AS ((_raw_data ->> 'pending_setup_intent'::text)) STORED,
    pending_update jsonb GENERATED ALWAYS AS ((_raw_data -> 'pending_update'::text)) STORED,
    status text GENERATED ALWAYS AS ((_raw_data ->> 'status'::text)) STORED,
    application_fee_percent double precision GENERATED ALWAYS AS (((_raw_data ->> 'application_fee_percent'::text))::double precision) STORED,
    billing_cycle_anchor integer GENERATED ALWAYS AS (((_raw_data ->> 'billing_cycle_anchor'::text))::integer) STORED,
    billing_thresholds jsonb GENERATED ALWAYS AS ((_raw_data -> 'billing_thresholds'::text)) STORED,
    cancel_at integer GENERATED ALWAYS AS (((_raw_data ->> 'cancel_at'::text))::integer) STORED,
    canceled_at integer GENERATED ALWAYS AS (((_raw_data ->> 'canceled_at'::text))::integer) STORED,
    collection_method text GENERATED ALWAYS AS ((_raw_data ->> 'collection_method'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    days_until_due integer GENERATED ALWAYS AS (((_raw_data ->> 'days_until_due'::text))::integer) STORED,
    default_source text GENERATED ALWAYS AS ((_raw_data ->> 'default_source'::text)) STORED,
    default_tax_rates jsonb GENERATED ALWAYS AS ((_raw_data -> 'default_tax_rates'::text)) STORED,
    discount jsonb GENERATED ALWAYS AS ((_raw_data -> 'discount'::text)) STORED,
    ended_at integer GENERATED ALWAYS AS (((_raw_data ->> 'ended_at'::text))::integer) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    next_pending_invoice_item_invoice integer GENERATED ALWAYS AS (((_raw_data ->> 'next_pending_invoice_item_invoice'::text))::integer) STORED,
    pause_collection jsonb GENERATED ALWAYS AS ((_raw_data -> 'pause_collection'::text)) STORED,
    pending_invoice_item_interval jsonb GENERATED ALWAYS AS ((_raw_data -> 'pending_invoice_item_interval'::text)) STORED,
    start_date integer GENERATED ALWAYS AS (((_raw_data ->> 'start_date'::text))::integer) STORED,
    transfer_data jsonb GENERATED ALWAYS AS ((_raw_data -> 'transfer_data'::text)) STORED,
    trial_end jsonb GENERATED ALWAYS AS ((_raw_data -> 'trial_end'::text)) STORED,
    trial_start jsonb GENERATED ALWAYS AS ((_raw_data -> 'trial_start'::text)) STORED,
    schedule text GENERATED ALWAYS AS ((_raw_data ->> 'schedule'::text)) STORED,
    customer text GENERATED ALWAYS AS ((_raw_data ->> 'customer'::text)) STORED,
    latest_invoice text GENERATED ALWAYS AS ((_raw_data ->> 'latest_invoice'::text)) STORED,
    plan text GENERATED ALWAYS AS ((_raw_data ->> 'plan'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.subscriptions OWNER TO postgres;

--
-- Name: tax_ids; Type: TABLE; Schema: stripe; Owner: postgres
--

CREATE TABLE stripe.tax_ids (
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    country text GENERATED ALWAYS AS ((_raw_data ->> 'country'::text)) STORED,
    customer text GENERATED ALWAYS AS ((_raw_data ->> 'customer'::text)) STORED,
    type text GENERATED ALWAYS AS ((_raw_data ->> 'type'::text)) STORED,
    value text GENERATED ALWAYS AS ((_raw_data ->> 'value'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    owner jsonb GENERATED ALWAYS AS ((_raw_data -> 'owner'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.tax_ids OWNER TO postgres;

--
-- Name: _sync_status id; Type: DEFAULT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe._sync_status ALTER COLUMN id SET DEFAULT nextval('stripe._sync_status_id_seq'::regclass);


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_items (id, user_id, product_id, quantity, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, slug, description, icon, image_url, brand, created_at) FROM stdin;
c8083634-2b31-4c2a-a7d5-53124c226181	Injectables	injectables	Premium injectable compounds	syringe	\N	medical	2026-01-02 21:02:21.273506
a228b41a-912b-4840-875e-4fd97d32b8c2	Orals	orals	Oral compounds for various goals	pill	\N	medical	2026-01-02 21:02:21.299057
df833390-bb19-41fc-bf79-a97e36d106d0	Post Cycle / Pharma	pct-pharma	Post cycle therapy and pharmaceutical products	heart	\N	medical	2026-01-02 21:02:21.304484
e50aa91b-192c-408f-a209-c5db756a2668	Peptides	peptides	Therapeutic peptide compounds	beaker	\N	medical	2026-01-02 21:02:21.309162
29c7885f-b220-4b5d-b81c-604367cc1732	Growth Hormone	growth-hormone	HGH and growth factor products	trending-up	\N	medical	2026-01-02 21:02:21.316046
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, product_id, quantity, price, name, image_url) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, user_id, status, subtotal, shipping, tax, total, shipping_address, billing_address, tracking_number, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: payment_methods; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_methods (id, name, type, enabled, description, instructions, icon, fee_note, sort_order, provider_key, created_at, updated_at) FROM stdin;
750b53fa-2e00-4b30-ab24-49dd8e5b7fde	Cash App	manual	t	Pay via Cash App	Send payment to $ForgeFormula. Include your order number in the notes.	smartphone	\N	2	cashapp	2026-01-03 04:34:00.789665	2026-01-03 04:34:00.789665
15776c61-3471-493c-8682-837d2d33c38b	Zelle	manual	t	Pay via Zelle bank transfer	Send payment to payments@forgeformula.com. Include your order number in the memo.	building-2	\N	3	zelle	2026-01-03 04:34:00.789665	2026-01-03 04:34:00.789665
508d4d57-bf61-4067-8189-ff1f5921b45d	Apple Pay	external	t	Pay with Apple Pay	Complete payment using Apple Pay on your device.	apple	\N	4	applepay	2026-01-03 04:34:00.789665	2026-01-03 04:34:00.789665
e4d6696c-609a-4be4-a946-fb14b623a9e7	Crypto (Bitcoin)	crypto	t	Pay with Bitcoin	Send BTC to the wallet address provided after order confirmation. Payment must be received within 30 minutes.	bitcoin	\N	5	btc	2026-01-03 04:34:00.789665	2026-01-03 04:34:00.789665
a05884f3-5370-47fc-86b6-01777ae5e22d	Crypto (USDT)	crypto	t	Pay with Tether (USDT)	Send USDT (ERC-20 or TRC-20) to the wallet address provided after order confirmation.	coins	\N	6	usdt	2026-01-03 04:34:00.789665	2026-01-03 04:34:00.789665
da730c42-ae9a-4b45-9a85-ac676d1796dd	Credit/Debit Card	card	f	Pay securely with your credit or debit card	You will be redirected to our secure payment processor to complete your purchase.	credit-card	\N	1	stripe	2026-01-03 04:34:00.789665	2026-01-03 04:34:00.789665
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, slug, description, short_description, price, compare_at_price, category_id, brand, image_url, images, stock, sku, featured, active, created_at, updated_at) FROM stdin;
7bb68c3c-5b82-40af-9ca1-07215d48921b	Dbol 25mg x30	dbol-25	Methandrostenolone tablets for strength and mass.	Dianabol 25mg (30 tablets)	45.00	\N	a228b41a-912b-4840-875e-4fd97d32b8c2	medical	/assets/generated_images/dianabol_oral_tablets_bottle.png	[]	80	\N	t	t	2026-01-02 21:02:21.384644	2026-01-02 21:02:21.384644
761e5299-ce75-4a0c-9e1d-e4b5ea997047	Anavar 25mg x30	anavar-25	High-dose Oxandrolone tablets.	Anavar 25mg (30 tablets)	60.00	\N	a228b41a-912b-4840-875e-4fd97d32b8c2	medical	/assets/generated_images/anavar_oral_tablets_bottle.png	[]	60	\N	t	t	2026-01-02 21:02:21.401214	2026-01-02 21:02:21.401214
31e993d5-3947-4833-81c8-b80299908536	Anavar 10mg x30	anavar-10	Standard dose Oxandrolone tablets.	Anavar 10mg (30 tablets)	45.00	\N	a228b41a-912b-4840-875e-4fd97d32b8c2	medical	/assets/generated_images/anavar_oral_tablets_bottle.png	[]	65	\N	f	t	2026-01-02 21:02:21.404255	2026-01-02 21:02:21.404255
07007085-0595-45b8-ae8a-b59ac77b0d47	Winstrol 25mg x30	winstrol-25	Stanozolol tablets for lean gains.	Winstrol 25mg (30 tablets)	45.00	\N	a228b41a-912b-4840-875e-4fd97d32b8c2	medical	/assets/generated_images/winstrol_oral_tablets_bottle.png	[]	75	\N	f	t	2026-01-02 21:02:21.390996	2026-01-02 21:02:21.390996
174d523b-9ad7-4a28-b2b6-eaf02977562e	Anadrol 25mg x30	anadrol-25	Oxymetholone for significant mass gains.	Anadrol 25mg (30 tablets)	45.00	\N	a228b41a-912b-4840-875e-4fd97d32b8c2	medical	/assets/generated_images/dianabol_oral_tablets_bottle.png	[]	70	\N	t	t	2026-01-02 21:02:21.387753	2026-01-02 21:02:21.387753
4c2b942b-2d4c-4b0f-a22e-0c4a838956e4	Superdrol 10mg x30	superdrol-10	Methyldrostanolone - potent oral compound.	Superdrol 10mg (30 tablets)	60.00	\N	a228b41a-912b-4840-875e-4fd97d32b8c2	medical	/assets/generated_images/dianabol_oral_tablets_bottle.png	[]	40	\N	f	t	2026-01-02 21:02:21.394402	2026-01-02 21:02:21.394402
c8c9ebf9-9307-46c0-9c37-42a39b0030d7	Superdrol injectable 40mg/ml	superdrol-inj-40	Injectable methyldrostanolone formulation.	Injectable Superdrol 40mg/ml	100.00	\N	a228b41a-912b-4840-875e-4fd97d32b8c2	medical	/assets/generated_images/testosterone_enanthate_vial.png	[]	25	\N	f	t	2026-01-02 21:02:21.397428	2026-01-02 21:02:21.397428
81e8d960-a54b-4db6-b457-4cecb9cf243e	Proviron 25mg x30	proviron-25	Mesterolone for androgen support.	Proviron 25mg (30 tablets)	60.00	\N	a228b41a-912b-4840-875e-4fd97d32b8c2	medical	/assets/generated_images/anavar_oral_tablets_bottle.png	[]	50	\N	f	t	2026-01-02 21:02:21.407517	2026-01-02 21:02:21.407517
cc01db57-5dc1-4afa-83d0-eed50cb28776	Accutane 20mg x30	accutane-20	Isotretinoin for acne management.	Accutane 20mg (30 capsules)	60.00	\N	a228b41a-912b-4840-875e-4fd97d32b8c2	medical	/assets/generated_images/anavar_oral_tablets_bottle.png	[]	55	\N	f	t	2026-01-02 21:02:21.412076	2026-01-02 21:02:21.412076
bc74f034-a017-477f-ba50-4ed9a01779c2	D.N.P 100mg x30	dnp-100	Dinitrophenol for metabolic enhancement.	DNP 100mg (30 capsules)	70.00	\N	a228b41a-912b-4840-875e-4fd97d32b8c2	medical	/assets/generated_images/winstrol_oral_tablets_bottle.png	[]	30	\N	f	t	2026-01-02 21:02:21.417814	2026-01-02 21:02:21.417814
306d90dc-9dfb-4dc2-8744-616daba75031	D.N.P 200mg x30	dnp-200	High-dose Dinitrophenol capsules.	DNP 200mg (30 capsules)	130.00	\N	a228b41a-912b-4840-875e-4fd97d32b8c2	medical	/assets/generated_images/winstrol_oral_tablets_bottle.png	[]	25	\N	f	t	2026-01-02 21:02:21.422174	2026-01-02 21:02:21.422174
47a1d621-93b2-4aa7-850c-9521cce7a0f3	Clen 40mcg x20	clen-40	Beta-2 agonist for thermogenic effect.	Clenbuterol 40mcg (20 tablets)	70.00	\N	a228b41a-912b-4840-875e-4fd97d32b8c2	medical	/assets/generated_images/winstrol_oral_tablets_bottle.png	[]	60	\N	t	t	2026-01-02 21:02:21.426834	2026-01-02 21:02:21.426834
fed987c7-da3f-4531-a990-2fd3430778ea	T3 25mcg x25	t3-25	Liothyronine for thyroid support.	T3 25mcg (25 tablets)	50.00	\N	a228b41a-912b-4840-875e-4fd97d32b8c2	medical	/assets/generated_images/winstrol_oral_tablets_bottle.png	[]	55	\N	f	t	2026-01-02 21:02:21.430629	2026-01-02 21:02:21.430629
b6ad5c47-a067-4253-a1f5-1b0af16235a2	D-Bombs x30	d-bombs-30	Combination sexual performance tablets.	D-Bombs (90mg Viagra/70mg Cialis) x30	80.00	\N	a228b41a-912b-4840-875e-4fd97d32b8c2	medical	/assets/generated_images/dianabol_oral_tablets_bottle.png	[]	45	\N	f	t	2026-01-02 21:02:21.442299	2026-01-02 21:02:21.442299
502b9e59-2b8e-4c30-ad8d-a6db7ba6c911	TBol 25mg x30	tbol-25	Chlorodehydromethyltestosterone tablets.	Turinabol 25mg (30 tablets)	50.00	\N	a228b41a-912b-4840-875e-4fd97d32b8c2	medical	/assets/generated_images/winstrol_oral_tablets_bottle.png	[]	50	\N	f	t	2026-01-02 21:02:21.437934	2026-01-02 21:02:21.437934
bd04ac97-ee1c-469d-b522-70099e1a39bf	Methyl-1-Testosterone 20mg x30	m1t-20	17a-methyl-1-testosterone tablets.	M1T 20mg (30 tablets)	70.00	\N	a228b41a-912b-4840-875e-4fd97d32b8c2	medical	/assets/generated_images/dianabol_oral_tablets_bottle.png	[]	35	\N	f	t	2026-01-02 21:02:21.445587	2026-01-02 21:02:21.445587
a1ba38e9-ea99-4d7e-a505-598af8d18aec	Cialis 40mg x30	cialis-40	Tadalafil for performance enhancement.	Cialis 40mg (30 tablets)	60.00	\N	a228b41a-912b-4840-875e-4fd97d32b8c2	medical	/assets/generated_images/anavar_oral_tablets_bottle.png	[]	70	\N	f	t	2026-01-02 21:02:21.434832	2026-01-02 21:02:21.434832
c9f9e6ca-5490-4f25-ba55-baf05ccbeda6	Clomid 25mg x30	clomid-25	Clomiphene citrate for PCT.	Clomid 25mg (30 tablets)	45.00	\N	df833390-bb19-41fc-bf79-a97e36d106d0	medical	/assets/generated_images/clomid_pct_tablets_bottle.png	[]	80	\N	t	t	2026-01-02 21:02:21.448709	2026-01-02 21:02:21.448709
f4754513-2694-4dd6-86c4-ee9749c67bf2	Nolvadex 25mg x30	nolvadex-25	Tamoxifen citrate for PCT.	Nolvadex 25mg (30 tablets)	45.00	\N	df833390-bb19-41fc-bf79-a97e36d106d0	medical	/assets/generated_images/nolvadex_pct_tablets_bottle.png	[]	85	\N	t	t	2026-01-02 21:02:21.452549	2026-01-02 21:02:21.452549
9708e56b-0eaa-4492-98b3-d065f0a22fa3	Adex 1mg x30	adex-1	Anastrozole aromatase inhibitor.	Arimidex 1mg (30 tablets)	40.00	\N	df833390-bb19-41fc-bf79-a97e36d106d0	medical	/assets/generated_images/arimidex_pct_tablets_bottle.png	[]	70	\N	f	t	2026-01-02 21:02:21.455502	2026-01-02 21:02:21.455502
add5c405-f8f7-4e7a-a12b-62e24cde4714	Aromasin 25mg x30	aromasin-25	Exemestane aromatase inhibitor.	Aromasin 25mg (30 tablets)	60.00	\N	df833390-bb19-41fc-bf79-a97e36d106d0	medical	/assets/generated_images/arimidex_pct_tablets_bottle.png	[]	55	\N	f	t	2026-01-02 21:02:21.458771	2026-01-02 21:02:21.458771
8a94a6fc-4175-4fc0-b9ee-397e7cf0fe7b	Letrozole 2.5mg x20	letrozole-25	Potent aromatase inhibitor.	Letrozole 2.5mg (20 tablets)	40.00	\N	df833390-bb19-41fc-bf79-a97e36d106d0	medical	/assets/generated_images/arimidex_pct_tablets_bottle.png	[]	55	\N	f	t	2026-01-02 21:02:21.500216	2026-01-02 21:02:21.500216
98212acc-4df8-4a32-8ca4-ab8e7194df6e	BPC-157 5mg	bpc157-5	Body protection compound peptide.	BPC-157 5mg vial	50.00	\N	e50aa91b-192c-408f-a209-c5db756a2668	medical	/assets/generated_images/bpc-157_peptide_vial.png	[]	55	\N	t	t	2026-01-02 21:02:21.527422	2026-01-02 21:02:21.527422
3c4da090-499b-4992-9194-73f4fa080ad8	Ozempic 4mg/3ml	ozempic-4	Semaglutide injection pen - brand.	Ozempic 4mg/3ml pen	500.00	\N	e50aa91b-192c-408f-a209-c5db756a2668	medical	/assets/generated_images/ozempic_injection_pen.png	[]	20	\N	t	t	2026-01-02 21:02:21.508363	2026-01-02 21:02:21.508363
8f935617-d5c6-49f0-8bf5-da12e03ae041	Ozempic 8mg/3ml	ozempic-8	High-dose Semaglutide injection pen.	Ozempic 8mg/3ml pen	800.00	\N	e50aa91b-192c-408f-a209-c5db756a2668	medical	/assets/generated_images/ozempic_injection_pen.png	[]	15	\N	t	t	2026-01-02 21:02:21.512644	2026-01-02 21:02:21.512644
ad4110d3-ae0a-416f-b766-a161ee40c489	Tirzepatide 10mg	tirz-10	GIP/GLP-1 dual agonist.	Tirzepatide 10mg vial	100.00	\N	e50aa91b-192c-408f-a209-c5db756a2668	medical	/assets/generated_images/tirzepatide_peptide_vial.png	[]	35	\N	t	t	2026-01-02 21:02:21.545392	2026-01-02 21:02:21.545392
ca10c1f4-829d-440a-9573-4ec3ed94f98f	Tirzepatide 15mg	tirz-15	High-dose dual agonist.	Tirzepatide 15mg vial	150.00	\N	e50aa91b-192c-408f-a209-c5db756a2668	medical	/assets/generated_images/tirzepatide_peptide_vial.png	[]	30	\N	f	t	2026-01-02 21:02:21.549019	2026-01-02 21:02:21.549019
3c07c32f-724f-48d8-ba25-2665e18680f1	Semaglutide (Generic) 2mg	sema-generic-2	Generic Semaglutide lyophilized powder.	Generic Semaglutide 2mg vial	50.00	\N	e50aa91b-192c-408f-a209-c5db756a2668	medical	/assets/generated_images/semaglutide_generic_vial.png	[]	40	\N	f	t	2026-01-02 21:02:21.517336	2026-01-02 21:02:21.517336
37b21574-95a1-452b-9ef7-2b2bbecb1bb1	Semaglutide (Generic) 5mg	sema-generic-5	High-dose generic Semaglutide powder.	Generic Semaglutide 5mg vial	125.00	\N	e50aa91b-192c-408f-a209-c5db756a2668	medical	/assets/generated_images/semaglutide_generic_vial.png	[]	35	\N	t	t	2026-01-02 21:02:21.520635	2026-01-02 21:02:21.520635
46aaf5c6-58b3-4143-9350-8859eff59849	Melanotan 2 10mg	mt2-10	Tanning and libido peptide.	Melanotan II 10mg vial	50.00	\N	e50aa91b-192c-408f-a209-c5db756a2668	medical	/assets/generated_images/melanotan_2_peptide_vial.png	[]	50	\N	f	t	2026-01-02 21:02:21.533417	2026-01-02 21:02:21.533417
c3b243cc-b98e-4337-a6e0-628a541750b5	TB-500 10mg	tb500-10	Healing peptide for tissue repair.	Thymosin Beta-4 10mg vial	80.00	\N	e50aa91b-192c-408f-a209-c5db756a2668	medical	/assets/generated_images/tb-500_peptide_vial.png	[]	50	\N	f	t	2026-01-02 21:02:21.523868	2026-01-02 21:02:21.523868
795cb359-9328-49bd-9d15-3d7fe7158da9	PT-141 10mg	pt141-10	Sexual function enhancement peptide.	Bremelanotide 10mg vial	50.00	\N	e50aa91b-192c-408f-a209-c5db756a2668	medical	/assets/generated_images/pt-141_peptide_vial.png	[]	45	\N	f	t	2026-01-02 21:02:21.530529	2026-01-02 21:02:21.530529
ef8d2664-8dc3-47aa-8dd2-adebc0a67d08	Lantus 100IU pen	lantus-100	Long-acting insulin analog.	Insulin Glargine 100IU pen	70.00	\N	e50aa91b-192c-408f-a209-c5db756a2668	medical	/assets/generated_images/lantus_insulin_pen.png	[]	30	\N	f	t	2026-01-02 21:02:21.536317	2026-01-02 21:02:21.536317
54ec03dd-150e-49c3-9a02-d848356f98dc	Humalog cartridge 100IU	humalog-100	Fast-acting insulin analog.	Insulin Lispro 100IU cartridge	70.00	\N	e50aa91b-192c-408f-a209-c5db756a2668	medical	/assets/generated_images/humalog_insulin_cartridge.png	[]	30	\N	f	t	2026-01-02 21:02:21.541468	2026-01-02 21:02:21.541468
29b524f7-d673-45c4-bfa7-942cf23f1a8b	Genotropin 36iu 12mg	genotropin-36	Pharmaceutical grade HGH pen.	Genotropin 36IU (12mg) pen	300.00	\N	29c7885f-b220-4b5d-b81c-604367cc1732	medical	/assets/generated_images/genotropin_hgh_pen.png	[]	10	\N	t	t	2026-01-02 21:02:21.57671	2026-01-02 21:02:21.57671
e0eb75b5-8d5a-4405-8cfe-a00de8f605a7	HGH 100IU kits	hgh-100	Human growth hormone 100IU total.	HGH 100IU kit	200.00	\N	29c7885f-b220-4b5d-b81c-604367cc1732	medical	/assets/generated_images/hgh_vial_kit.png	[]	25	\N	f	t	2026-01-02 21:02:21.57323	2026-01-02 21:02:21.57323
92d270b1-22f9-4349-ab0b-66da1037c95d	HGH 150IU kits	hgh-150	Human growth hormone 150IU total.	HGH 150IU kit	250.00	\N	29c7885f-b220-4b5d-b81c-604367cc1732	medical	/assets/generated_images/hgh_vial_kit.png	[]	20	\N	t	t	2026-01-02 21:02:21.565138	2026-01-02 21:02:21.565138
ef6d1d80-8530-475f-bbff-f956ce7d95f1	HGH 240IU kits	hgh-240	Human growth hormone 240IU total.	HGH 240IU kit	450.00	\N	29c7885f-b220-4b5d-b81c-604367cc1732	medical	/assets/generated_images/hgh_vial_kit.png	[]	15	\N	t	t	2026-01-02 21:02:21.56897	2026-01-02 21:02:21.56897
7586a099-a846-40c7-a4f7-3f02334500c1	IGF1-LR3 1mg	igf1-lr3-1	Long-acting insulin-like growth factor.	IGF-1 LR3 1mg vial	70.00	\N	29c7885f-b220-4b5d-b81c-604367cc1732	medical	/assets/generated_images/igf-1_lr3_peptide_vial.png	[]	40	\N	f	t	2026-01-02 21:02:21.553267	2026-01-02 21:02:21.553267
1866ec29-96bd-4277-9bf8-dd071f2d565b	Test E 300mg/ml	test-e-300	Premium quality Testosterone Enanthate at 300mg/ml concentration. Lab tested for purity and potency.	Testosterone Enanthate 300mg/ml	50.00	\N	c8083634-2b31-4c2a-a7d5-53124c226181	medical	/assets/generated_images/testosterone_enanthate_vial.png	[]	100	\N	t	t	2026-01-02 21:02:21.322184	2026-01-02 21:02:21.322184
12b04688-bc7b-4145-bf7c-81448abc9b42	Test C 250mg/ml	test-c-250	High quality Testosterone Cypionate for consistent results.	Testosterone Cypionate 250mg/ml	55.00	\N	c8083634-2b31-4c2a-a7d5-53124c226181	medical	/assets/generated_images/testosterone_cypionate_vial.png	[]	100	\N	t	t	2026-01-02 21:02:21.326888	2026-01-02 21:02:21.326888
8c1d39af-0378-49c8-abad-397c02e34821	Test C 50mg/ml	test-c-50-female	Lower concentration Testosterone Cypionate formulated for female use.	Testosterone Cypionate 50mg/ml - Female Only	50.00	\N	c8083634-2b31-4c2a-a7d5-53124c226181	medical	/assets/generated_images/testosterone_cypionate_vial.png	[]	50	\N	f	t	2026-01-02 21:02:21.330864	2026-01-02 21:02:21.330864
d33c9d33-fb5f-4966-be94-8bbcb10dde9d	Test P 100mg/ml	test-p-100	Fast-acting Testosterone Propionate.	Testosterone Propionate 100mg/ml	35.00	\N	c8083634-2b31-4c2a-a7d5-53124c226181	medical	/assets/generated_images/testosterone_propionate_vial.png	[]	80	\N	f	t	2026-01-02 21:02:21.334208	2026-01-02 21:02:21.334208
3127425b-e4c2-4a84-8e6c-6298cbd61467	Test Gel 50mg/pack x30	test-gel-50	Transdermal testosterone gel for daily application.	Testosterone Gel 50mg per pack (30 packs)	\N	\N	c8083634-2b31-4c2a-a7d5-53124c226181	medical	/assets/generated_images/testosterone_gel_sachets_pack.png	[]	40	\N	f	t	2026-01-02 21:02:21.340833	2026-01-02 21:02:21.340833
ff31c64b-ebc0-408a-b1df-1e80a43c1ef1	Tren E 200mg/ml	tren-e-200	Long-ester Trenbolone for advanced users.	Trenbolone Enanthate 200mg/ml	80.00	\N	c8083634-2b31-4c2a-a7d5-53124c226181	medical	/assets/generated_images/trenbolone_enanthate_vial.png	[]	50	\N	t	t	2026-01-02 21:02:21.343971	2026-01-02 21:02:21.343971
41531c95-766d-4b97-8d04-5fe93eaebf66	Tren A 100mg/ml	tren-a-100	Fast-acting Trenbolone Acetate.	Trenbolone Acetate 100mg/ml	65.00	\N	c8083634-2b31-4c2a-a7d5-53124c226181	medical	/assets/generated_images/trenbolone_acetate_vial.png	[]	60	\N	f	t	2026-01-02 21:02:21.346099	2026-01-02 21:02:21.346099
8837e61e-cf63-4fe6-ba6b-50267ef73104	Tren H 100mg/ml	tren-h-100	Parabolan - premium Trenbolone ester.	Trenbolone Hexahydrobenzylcarbonate 100mg/ml	100.00	\N	c8083634-2b31-4c2a-a7d5-53124c226181	medical	/assets/generated_images/trenbolone_enanthate_vial.png	[]	30	\N	f	t	2026-01-02 21:02:21.349639	2026-01-02 21:02:21.349639
33409527-a8db-4a4d-b617-20f733d5a76d	Mast E 200mg/ml	mast-e-200	Long-ester Drostanolone for cutting.	Masteron Enanthate 200mg/ml	75.00	\N	c8083634-2b31-4c2a-a7d5-53124c226181	medical	/assets/generated_images/masteron_enanthate_vial.png	[]	45	\N	f	t	2026-01-02 21:02:21.374905	2026-01-02 21:02:21.374905
2925a2d4-df60-43a2-9a87-393b3fbb741c	Mast P 100mg/ml	mast-p-100	Fast-acting Drostanolone Propionate.	Masteron Propionate 100mg/ml	65.00	\N	c8083634-2b31-4c2a-a7d5-53124c226181	medical	/assets/generated_images/masteron_enanthate_vial.png	[]	50	\N	f	t	2026-01-02 21:02:21.37827	2026-01-02 21:02:21.37827
76e37b53-9460-4b0b-bad7-dd34f3b580d7	Deca 200mg/ml	deca-200	Quality Nandrolone for mass and joint support.	Nandrolone Decanoate 200mg/ml	65.00	\N	c8083634-2b31-4c2a-a7d5-53124c226181	medical	/assets/generated_images/deca_durabolin_vial.png	[]	70	\N	t	t	2026-01-02 21:02:21.366516	2026-01-02 21:02:21.366516
9599df80-e239-4826-a84c-f42bb3d601c7	NPP 200mg/ml	npp-200	Fast-acting Nandrolone ester.	Nandrolone Phenylpropionate 200mg/ml	65.00	\N	c8083634-2b31-4c2a-a7d5-53124c226181	medical	/assets/generated_images/deca_durabolin_vial.png	[]	55	\N	f	t	2026-01-02 21:02:21.372004	2026-01-02 21:02:21.372004
b00118eb-29ee-406b-96cc-49c17423cf10	PRIMO E 150mg/ml	primo-e-150	Premium Methenolone Enanthate.	Primobolan Enanthate 150mg/ml	100.00	\N	c8083634-2b31-4c2a-a7d5-53124c226181	medical	/assets/generated_images/primobolan_enanthate_vial.png	[]	30	\N	t	t	2026-01-02 21:02:21.369381	2026-01-02 21:02:21.369381
c3c05e0b-9ca4-4ba8-9e15-8902ccb7505c	Sus 250mg/ml	sus-250	Blend of four testosterone esters for sustained release.	Sustanon 250mg/ml	60.00	\N	c8083634-2b31-4c2a-a7d5-53124c226181	medical	/assets/generated_images/sustanon_blend_vial.png	[]	75	\N	t	t	2026-01-02 21:02:21.337485	2026-01-02 21:02:21.337485
e93da71f-9c17-4eee-948a-7b9fce2dcb9f	Eq Cyp 200mg/ml	eq-cyp-200	Equipoise Cypionate for quality gains.	Boldenone Cypionate 200mg/ml	65.00	\N	c8083634-2b31-4c2a-a7d5-53124c226181	medical	/assets/generated_images/testosterone_enanthate_vial.png	[]	60	\N	f	t	2026-01-02 21:02:21.380835	2026-01-02 21:02:21.380835
43df98b3-77cb-4e2e-af5b-4a1ce04a9107	DHB cyp-100mg/ml	dhb-cyp-100	1-Testosterone Cypionate - premium anabolic.	Dihydroboldenone Cypionate 100mg/ml	70.00	\N	c8083634-2b31-4c2a-a7d5-53124c226181	medical	/assets/generated_images/testosterone_enanthate_vial.png	[]	35	\N	f	t	2026-01-02 21:02:21.360321	2026-01-02 21:02:21.360321
1ac97fb8-2263-412e-9442-f667d001b5b7	TREST A 75mg/ml	trest-a-75	Potent synthetic androgen compound.	Trestolone Acetate 75mg/ml	120.00	\N	c8083634-2b31-4c2a-a7d5-53124c226181	medical	/assets/generated_images/testosterone_enanthate_vial.png	[]	25	\N	t	t	2026-01-02 21:02:21.353855	2026-01-02 21:02:21.353855
528432b1-7c3d-4409-a25d-a33dfb8de4b1	TREST E 120mg/ml	trest-e-120	Long-ester Trestolone for sustained effects.	Trestolone Enanthate 120mg/ml	200.00	\N	c8083634-2b31-4c2a-a7d5-53124c226181	medical	/assets/generated_images/testosterone_enanthate_vial.png	[]	20	\N	f	t	2026-01-02 21:02:21.357192	2026-01-02 21:02:21.357192
86466cf5-d426-4cbf-a0a9-6241c7ea5724	Prami .25mg x20	prami-025	Dopamine agonist for prolactin control.	Pramipexole 0.25mg (20 tablets)	40.00	\N	df833390-bb19-41fc-bf79-a97e36d106d0	medical	/assets/generated_images/clomid_pct_tablets_bottle.png	[]	45	\N	f	t	2026-01-02 21:02:21.461384	2026-01-02 21:02:21.461384
a3ef9ecb-7496-4e9a-bca5-6bf1f90ffd56	Cabergoline .5mg x20	cabergoline-05	Dopamine agonist for prolactin.	Cabergoline 0.5mg (20 tablets)	60.00	\N	df833390-bb19-41fc-bf79-a97e36d106d0	medical	/assets/generated_images/clomid_pct_tablets_bottle.png	[]	40	\N	t	t	2026-01-02 21:02:21.471021	2026-01-02 21:02:21.471021
b34848ce-33fa-404a-8f59-85fc5cedbe45	Raloxifene 60mg x20	raloxifene-60	SERM for estrogen modulation.	Raloxifene 60mg (20 tablets)	50.00	\N	df833390-bb19-41fc-bf79-a97e36d106d0	medical	/assets/generated_images/clomid_pct_tablets_bottle.png	[]	45	\N	f	t	2026-01-02 21:02:21.504583	2026-01-02 21:02:21.504583
e352a7ff-060a-4077-bda9-7325f3df1ae4	Metformin 850mg x30	metformin-850	Glucose management medication.	Metformin 850mg (30 tablets)	60.00	\N	df833390-bb19-41fc-bf79-a97e36d106d0	medical	/assets/generated_images/nolvadex_pct_tablets_bottle.png	[]	60	\N	f	t	2026-01-02 21:02:21.464332	2026-01-02 21:02:21.464332
2c5e40a2-c4a3-4449-bd3b-69b9fd54440d	Telmisartan 40mg x30	telmisartan-40	ARB for blood pressure management.	Telmisartan 40mg (30 tablets)	50.00	\N	df833390-bb19-41fc-bf79-a97e36d106d0	medical	/assets/generated_images/nolvadex_pct_tablets_bottle.png	[]	50	\N	f	t	2026-01-02 21:02:21.467541	2026-01-02 21:02:21.467541
a4988bad-9138-46f4-8cbc-51843ac21f86	Lasix 40mg x10	lasix-40	Furosemide diuretic.	Lasix 40mg (10 tablets)	30.00	\N	df833390-bb19-41fc-bf79-a97e36d106d0	medical	/assets/generated_images/nolvadex_pct_tablets_bottle.png	[]	50	\N	f	t	2026-01-02 21:02:21.479018	2026-01-02 21:02:21.479018
9cfed061-c676-4785-8452-31e0b618322b	Modafinil 200mg x20	modafinil-200	Wakefulness-promoting agent.	Modafinil 200mg (20 tablets)	60.00	\N	df833390-bb19-41fc-bf79-a97e36d106d0	medical	/assets/generated_images/nolvadex_pct_tablets_bottle.png	[]	45	\N	f	t	2026-01-02 21:02:21.482604	2026-01-02 21:02:21.482604
0545c203-0cca-456f-bf44-ebde160ccc39	Finasteride 1mg x30	finasteride-1	5-alpha reductase inhibitor.	Finasteride 1mg (30 tablets)	50.00	\N	df833390-bb19-41fc-bf79-a97e36d106d0	medical	/assets/generated_images/nolvadex_pct_tablets_bottle.png	[]	60	\N	f	t	2026-01-02 21:02:21.485988	2026-01-02 21:02:21.485988
ca7030b1-d1ee-4a18-9077-7e9f21628f50	Hydrochlorothiazide 12.5mg x30	hctz-125	Thiazide diuretic - low dose.	HCTZ 12.5mg (30 tablets)	45.00	\N	df833390-bb19-41fc-bf79-a97e36d106d0	medical	/assets/generated_images/nolvadex_pct_tablets_bottle.png	[]	50	\N	f	t	2026-01-02 21:02:21.489834	2026-01-02 21:02:21.489834
462fa5fb-2eca-486d-ab2f-20cbfe5b2870	Hydrochlorothiazide 25mg x30	hctz-25	Thiazide diuretic - standard dose.	HCTZ 25mg (30 tablets)	60.00	\N	df833390-bb19-41fc-bf79-a97e36d106d0	medical	/assets/generated_images/nolvadex_pct_tablets_bottle.png	[]	45	\N	f	t	2026-01-02 21:02:21.492724	2026-01-02 21:02:21.492724
16e39d3e-39f1-4eb5-972a-ab64e560a047	Nebivolol 10mg x30	nebivolol-10	Beta blocker for BP management.	Nebivolol 10mg (30 tablets)	50.00	\N	df833390-bb19-41fc-bf79-a97e36d106d0	medical	/assets/generated_images/nolvadex_pct_tablets_bottle.png	[]	40	\N	f	t	2026-01-02 21:02:21.497147	2026-01-02 21:02:21.497147
fae13195-5a82-4767-b45c-8f00af22658f	HCG 5000iu	hcg-5000	Human chorionic gonadotropin.	HCG 5000iu vial	50.00	\N	df833390-bb19-41fc-bf79-a97e36d106d0	medical	/assets/generated_images/bpc-157_peptide_vial.png	[]	55	\N	t	t	2026-01-02 21:02:21.474208	2026-01-02 21:02:21.474208
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, product_id, user_id, rating, title, content, verified, created_at) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (sid, sess, expire) FROM stdin;
PmB-OehCAAVoyGpf2HBJM7T10xAXNlqM	{"cookie": {"path": "/", "secure": true, "expires": "2026-01-11T13:19:51.249Z", "httpOnly": true, "originalMaxAge": 604800000}, "replit.com": {"code_verifier": "I16mlpXspN9in6Bd4GtuckV9NCH-gsw02NjZl08zMCQ"}}	2026-01-11 13:53:25
xJqsaDH1RNrSGBhNi8j2BxclFlQlhtWC	{"cookie": {"path": "/", "secure": true, "expires": "2026-01-11T05:15:31.691Z", "httpOnly": true, "originalMaxAge": 604800000}, "replit.com": {"code_verifier": "N0O3ox7le0mmM65XTW183eNbjflBK72cGosXKpNsMLE"}}	2026-01-11 05:21:28
D8qmDeUzX8mmnEr0ErBkc_uGLE8mXAcr	{"cookie": {"path": "/", "secure": true, "expires": "2026-01-16T21:45:03.931Z", "httpOnly": true, "originalMaxAge": 604800000}, "passport": {"user": {"claims": {"aud": "409ba0b6-5545-4f22-9d4e-1f46a108a07d", "exp": 1767998703, "iat": 1767995103, "iss": "https://replit.com/oidc", "sub": "42680475", "email": "iquann18@gmail.com", "at_hash": "RpA3Pj82EbxFMnmtOg70MA", "username": "iquann18", "auth_time": 1767412070, "last_name": null, "first_name": null}, "expires_at": 1767998703, "access_token": "mz8TYmzahu9jxzz0m4yZmiDmtJZzkAbnPl4Tfll0e3M", "refresh_token": "hiNH7uDnyVjKMRUZJqeJH9rxaH9yiIYNv2lfJljLS3R"}}}	2026-01-18 14:00:56
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, first_name, last_name, profile_image_url, created_at, updated_at) FROM stdin;
42680475	iquann18@gmail.com	\N	\N	\N	2026-01-03 03:47:51.532123	2026-01-03 03:47:51.532123
\.


--
-- Data for Name: _managed_webhooks; Type: TABLE DATA; Schema: stripe; Owner: postgres
--

COPY stripe._managed_webhooks (id, object, url, enabled_events, description, enabled, livemode, metadata, secret, status, api_version, created, updated_at, last_synced_at, account_id) FROM stdin;
we_1SlMCpAlUoGRktTKRIWhYM3k	webhook_endpoint	https://409ba0b6-5545-4f22-9d4e-1f46a108a07d-00-23rx5k17x5kv4.kirk.replit.dev/api/stripe/webhook	["charge.captured", "charge.dispute.closed", "charge.dispute.created", "charge.dispute.funds_reinstated", "charge.dispute.funds_withdrawn", "charge.dispute.updated", "charge.expired", "charge.failed", "charge.pending", "charge.refund.updated", "charge.refunded", "charge.succeeded", "charge.updated", "checkout.session.async_payment_failed", "checkout.session.async_payment_succeeded", "checkout.session.completed", "checkout.session.expired", "credit_note.created", "credit_note.updated", "credit_note.voided", "customer.created", "customer.deleted", "customer.subscription.created", "customer.subscription.deleted", "customer.subscription.paused", "customer.subscription.pending_update_applied", "customer.subscription.pending_update_expired", "customer.subscription.resumed", "customer.subscription.trial_will_end", "customer.subscription.updated", "customer.tax_id.created", "customer.tax_id.deleted", "customer.tax_id.updated", "customer.updated", "entitlements.active_entitlement_summary.updated", "invoice.created", "invoice.deleted", "invoice.finalization_failed", "invoice.finalized", "invoice.marked_uncollectible", "invoice.paid", "invoice.payment_action_required", "invoice.payment_failed", "invoice.payment_succeeded", "invoice.sent", "invoice.upcoming", "invoice.updated", "invoice.voided", "payment_intent.amount_capturable_updated", "payment_intent.canceled", "payment_intent.created", "payment_intent.partially_funded", "payment_intent.payment_failed", "payment_intent.processing", "payment_intent.requires_action", "payment_intent.succeeded", "payment_method.attached", "payment_method.automatically_updated", "payment_method.card_automatically_updated", "payment_method.detached", "payment_method.updated", "plan.created", "plan.deleted", "plan.updated", "price.created", "price.deleted", "price.updated", "product.created", "product.deleted", "product.updated", "radar.early_fraud_warning.created", "radar.early_fraud_warning.updated", "refund.created", "refund.failed", "refund.updated", "review.closed", "review.opened", "setup_intent.canceled", "setup_intent.created", "setup_intent.requires_action", "setup_intent.setup_failed", "setup_intent.succeeded", "subscription_schedule.aborted", "subscription_schedule.canceled", "subscription_schedule.completed", "subscription_schedule.created", "subscription_schedule.expiring", "subscription_schedule.released", "subscription_schedule.updated"]	\N	\N	f	{"managed_by": "stripe-sync"}	whsec_K3JdeUBD4tbue77GNzUBX4vrJi9a9Z02	enabled	\N	1767413567	2026-01-03 04:12:47.918412+00	2026-01-03 04:12:47.916+00	acct_1SlB57AlUoGRktTK
\.


--
-- Data for Name: _migrations; Type: TABLE DATA; Schema: stripe; Owner: postgres
--

COPY stripe._migrations (id, name, hash, executed_at) FROM stdin;
0	initial_migration	c18983eedaa79cc2f6d92727d70c4f772256ef3d	2026-01-03 04:12:37.554678
1	products	b99ffc23df668166b94156f438bfa41818d4e80c	2026-01-03 04:12:37.56349
2	customers	33e481247ddc217f4e27ad10dfe5430097981670	2026-01-03 04:12:37.581882
3	prices	7d5ff35640651606cc24cec8a73ff7c02492ecdf	2026-01-03 04:12:37.605726
4	subscriptions	2cc6121a943c2a623c604e5ab12118a57a6c329a	2026-01-03 04:12:37.636196
5	invoices	7fbb4ccb4ed76a830552520739aaa163559771b1	2026-01-03 04:12:37.647832
6	charges	fb284ed969f033f5ce19f479b7a7e27871bddf09	2026-01-03 04:12:37.65868
7	coupons	7ed6ec4133f120675fd7888c0477b6281743fede	2026-01-03 04:12:37.667776
8	disputes	29bdb083725efe84252647f043f5f91cd0dabf43	2026-01-03 04:12:37.676967
9	events	b28cb55b5b69a9f52ef519260210cd76eea3c84e	2026-01-03 04:12:37.685325
10	payouts	69d1050b88bba1024cea4a671f9633ce7bfe25ff	2026-01-03 04:12:37.694187
11	plans	fc1ae945e86d1222a59cbcd3ae7e81a3a282a60c	2026-01-03 04:12:37.702944
12	add_updated_at	1d80945ef050a17a26e35e9983a58178262470f2	2026-01-03 04:12:37.711253
13	add_subscription_items	2aa63409bfe910add833155ad7468cdab844e0f1	2026-01-03 04:12:37.725058
14	migrate_subscription_items	8c2a798b44a8a0d83ede6f50ea7113064ecc1807	2026-01-03 04:12:37.733802
15	add_customer_deleted	6886ddfd8c129d3c4b39b59519f92618b397b395	2026-01-03 04:12:37.738651
16	add_invoice_indexes	d6bb9a09d5bdf580986ed14f55db71227a4d356d	2026-01-03 04:12:37.741851
17	drop_charges_unavailable_columns	61cd5adec4ae2c308d2c33d1b0ed203c7d074d6a	2026-01-03 04:12:37.749459
18	setup_intents	1d45d0fa47fc145f636c9e3c1ea692417fbb870d	2026-01-03 04:12:37.759317
19	payment_methods	705bdb15b50f1a97260b4f243008b8a34d23fb09	2026-01-03 04:12:37.769663
20	disputes_payment_intent_created_idx	18b2cecd7c097a7ea3b3f125f228e8790288d5ca	2026-01-03 04:12:37.781089
21	payment_intent	b1f194ff521b373c4c7cf220c0feadc253ebff0b	2026-01-03 04:12:37.787054
22	adjust_plans	e4eae536b0bc98ee14d78e818003952636ee877c	2026-01-03 04:12:37.800993
23	invoice_deleted	78e864c3146174fee7d08f05226b02d931d5b2ae	2026-01-03 04:12:37.80613
24	subscription_schedules	85fa6adb3815619bb17e1dafb00956ff548f7332	2026-01-03 04:12:37.810163
25	tax_ids	3f9a1163533f9e60a53d61dae5e451ab937584d9	2026-01-03 04:12:37.823741
26	credit_notes	e099b6b04ee607ee868d82af5193373c3fc266d2	2026-01-03 04:12:37.836907
27	add_marketing_features_to_products	6ed1774b0a9606c5937b2385d61057408193e8a7	2026-01-03 04:12:37.850932
28	early_fraud_warning	e615b0b73fa13d3b0508a1956d496d516f0ebf40	2026-01-03 04:12:37.853639
29	reviews	dd3f914139725a7934dc1062de4cc05aece77aea	2026-01-03 04:12:37.866802
30	refunds	f76c4e273eccdc96616424d73967a9bea3baac4e	2026-01-03 04:12:37.883202
31	add_default_price	6d10566a68bc632831fa25332727d8ff842caec5	2026-01-03 04:12:37.898363
32	update_subscription_items	e894858d46840ba4be5ea093cdc150728bd1d66f	2026-01-03 04:12:37.902597
33	add_last_synced_at	43124eb65b18b70c54d57d2b4fcd5dae718a200f	2026-01-03 04:12:37.905794
34	remove_foreign_keys	e72ec19f3232cf6e6b7308ebab80341c2341745f	2026-01-03 04:12:37.912067
35	checkout_sessions	dc294f5bb1a4d613be695160b38a714986800a75	2026-01-03 04:12:37.916367
36	checkout_session_line_items	82c8cfce86d68db63a9fa8de973bfe60c91342dd	2026-01-03 04:12:37.942362
37	add_features	c68a2c2b7e3808eed28c8828b2ffd3a2c9bf2bd4	2026-01-03 04:12:37.959502
38	active_entitlement	5b3858e7a52212b01e7f338cf08e29767ab362af	2026-01-03 04:12:37.970191
39	add_paused_to_subscription_status	09012b5d128f6ba25b0c8f69a1203546cf1c9f10	2026-01-03 04:12:37.990506
40	managed_webhooks	1d453dfd0e27ff0c2de97955c4ec03919af0af7f	2026-01-03 04:12:37.994683
41	rename_managed_webhooks	ad7cd1e4971a50790bf997cd157f3403d294484f	2026-01-03 04:12:38.01749
42	convert_to_jsonb_generated_columns	e0703a0e5cd9d97db53d773ada1983553e37813c	2026-01-03 04:12:38.02237
43	add_account_id	9a6beffdd0972e3657b7118b2c5001be1f815faf	2026-01-03 04:12:41.983053
44	make_account_id_required	05c1e9145220e905e0c1ca5329851acaf7e9e506	2026-01-03 04:12:41.995971
45	sync_status	2f88c4883fa885a6eaa23b8b02da958ca77a1c21	2026-01-03 04:12:42.0113
46	sync_status_per_account	b1f1f3d4fdb4b4cf4e489d4b195c7f0f97f9f27c	2026-01-03 04:12:42.02796
47	api_key_hashes	8046e4c57544b8eae277b057d201a28a4529ffe3	2026-01-03 04:12:42.060146
48	rename_reserved_columns	e32290f655550ed308a7f2dcb5b0114e49a0558e	2026-01-03 04:12:42.06487
49	remove_redundant_underscores_from_metadata_tables	96d6f3a54e17d8e19abd022a030a95a6161bf73e	2026-01-03 04:12:46.714891
50	rename_id_to_match_stripe_api	c5300c5a10081c033dab9961f4e3cd6a2440c2b6	2026-01-03 04:12:46.730849
51	remove_webhook_uuid	289bee08167858dbf4d04ca184f42681660ebb66	2026-01-03 04:12:47.073062
52	webhook_url_uniqueness	d02aec1815ce3a108b8a1def1ff24e865b26db70	2026-01-03 04:12:47.081651
\.


--
-- Data for Name: _sync_status; Type: TABLE DATA; Schema: stripe; Owner: postgres
--

COPY stripe._sync_status (id, resource, status, last_synced_at, last_incremental_cursor, error_message, updated_at, account_id) FROM stdin;
\.


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: stripe; Owner: postgres
--

COPY stripe.accounts (_raw_data, first_synced_at, _last_synced_at, _updated_at, api_key_hashes) FROM stdin;
{"id": "acct_1SlB57AlUoGRktTK", "type": "standard", "email": null, "object": "account", "country": "US", "settings": {"payouts": {"schedule": {"interval": "daily", "delay_days": 2}, "statement_descriptor": null, "debit_negative_balances": true}, "branding": {"icon": null, "logo": null, "primary_color": null, "secondary_color": null}, "invoices": {"default_account_tax_ids": null, "hosted_payment_method_save": "offer"}, "payments": {"statement_descriptor": null, "statement_descriptor_kana": null, "statement_descriptor_kanji": null}, "dashboard": {"timezone": "Etc/UTC", "display_name": "Commerce Canvas Sandbox"}, "card_issuing": {"tos_acceptance": {"ip": null, "date": null}}, "card_payments": {"statement_descriptor_prefix": null, "statement_descriptor_prefix_kana": null, "statement_descriptor_prefix_kanji": null}, "bacs_debit_payments": {"display_name": null, "service_user_number": null}, "sepa_debit_payments": {}}, "controller": {"type": "account"}, "capabilities": {}, "business_type": null, "charges_enabled": false, "payouts_enabled": false, "business_profile": {"mcc": null, "url": null, "name": null, "support_url": null, "support_email": null, "support_phone": null, "annual_revenue": null, "support_address": null, "estimated_worker_count": null, "minority_owned_business_designation": null}, "default_currency": "usd", "details_submitted": false}	2026-01-03 04:12:47.622217+00	2026-01-03 04:12:47.622217+00	2026-01-03 04:12:47.622217+00	{444d3ac2b1b72ace9fcfecd5383d7374c3e146d4938ae4653eee58744649de13}
\.


--
-- Data for Name: active_entitlements; Type: TABLE DATA; Schema: stripe; Owner: postgres
--

COPY stripe.active_entitlements (_updated_at, _last_synced_at, _raw_data, _account_id) FROM stdin;
\.


--
-- Data for Name: charges; Type: TABLE DATA; Schema: stripe; Owner: postgres
--

COPY stripe.charges (_updated_at, _last_synced_at, _raw_data, _account_id) FROM stdin;
\.


--
-- Data for Name: checkout_session_line_items; Type: TABLE DATA; Schema: stripe; Owner: postgres
--

COPY stripe.checkout_session_line_items (_updated_at, _last_synced_at, _raw_data, _account_id) FROM stdin;
\.


--
-- Data for Name: checkout_sessions; Type: TABLE DATA; Schema: stripe; Owner: postgres
--

COPY stripe.checkout_sessions (_updated_at, _last_synced_at, _raw_data, _account_id) FROM stdin;
\.


--
-- Data for Name: coupons; Type: TABLE DATA; Schema: stripe; Owner: postgres
--

COPY stripe.coupons (_updated_at, _last_synced_at, _raw_data) FROM stdin;
\.


--
-- Data for Name: credit_notes; Type: TABLE DATA; Schema: stripe; Owner: postgres
--

COPY stripe.credit_notes (_last_synced_at, _raw_data, _account_id) FROM stdin;
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: stripe; Owner: postgres
--

COPY stripe.customers (_updated_at, _last_synced_at, _raw_data, _account_id) FROM stdin;
\.


--
-- Data for Name: disputes; Type: TABLE DATA; Schema: stripe; Owner: postgres
--

COPY stripe.disputes (_updated_at, _last_synced_at, _raw_data, _account_id) FROM stdin;
\.


--
-- Data for Name: early_fraud_warnings; Type: TABLE DATA; Schema: stripe; Owner: postgres
--

COPY stripe.early_fraud_warnings (_updated_at, _last_synced_at, _raw_data, _account_id) FROM stdin;
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: stripe; Owner: postgres
--

COPY stripe.events (_updated_at, _last_synced_at, _raw_data) FROM stdin;
\.


--
-- Data for Name: features; Type: TABLE DATA; Schema: stripe; Owner: postgres
--

COPY stripe.features (_updated_at, _last_synced_at, _raw_data, _account_id) FROM stdin;
\.


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: stripe; Owner: postgres
--

COPY stripe.invoices (_updated_at, _last_synced_at, _raw_data, _account_id) FROM stdin;
\.


--
-- Data for Name: payment_intents; Type: TABLE DATA; Schema: stripe; Owner: postgres
--

COPY stripe.payment_intents (_last_synced_at, _raw_data, _account_id) FROM stdin;
\.


--
-- Data for Name: payment_methods; Type: TABLE DATA; Schema: stripe; Owner: postgres
--

COPY stripe.payment_methods (_last_synced_at, _raw_data, _account_id) FROM stdin;
\.


--
-- Data for Name: payouts; Type: TABLE DATA; Schema: stripe; Owner: postgres
--

COPY stripe.payouts (_updated_at, _last_synced_at, _raw_data) FROM stdin;
\.


--
-- Data for Name: plans; Type: TABLE DATA; Schema: stripe; Owner: postgres
--

COPY stripe.plans (_updated_at, _last_synced_at, _raw_data, _account_id) FROM stdin;
\.


--
-- Data for Name: prices; Type: TABLE DATA; Schema: stripe; Owner: postgres
--

COPY stripe.prices (_updated_at, _last_synced_at, _raw_data, _account_id) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: stripe; Owner: postgres
--

COPY stripe.products (_updated_at, _last_synced_at, _raw_data, _account_id) FROM stdin;
\.


--
-- Data for Name: refunds; Type: TABLE DATA; Schema: stripe; Owner: postgres
--

COPY stripe.refunds (_updated_at, _last_synced_at, _raw_data, _account_id) FROM stdin;
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: stripe; Owner: postgres
--

COPY stripe.reviews (_updated_at, _last_synced_at, _raw_data, _account_id) FROM stdin;
\.


--
-- Data for Name: setup_intents; Type: TABLE DATA; Schema: stripe; Owner: postgres
--

COPY stripe.setup_intents (_last_synced_at, _raw_data, _account_id) FROM stdin;
\.


--
-- Data for Name: subscription_items; Type: TABLE DATA; Schema: stripe; Owner: postgres
--

COPY stripe.subscription_items (_last_synced_at, _raw_data, _account_id) FROM stdin;
\.


--
-- Data for Name: subscription_schedules; Type: TABLE DATA; Schema: stripe; Owner: postgres
--

COPY stripe.subscription_schedules (_last_synced_at, _raw_data, _account_id) FROM stdin;
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: stripe; Owner: postgres
--

COPY stripe.subscriptions (_updated_at, _last_synced_at, _raw_data, _account_id) FROM stdin;
\.


--
-- Data for Name: tax_ids; Type: TABLE DATA; Schema: stripe; Owner: postgres
--

COPY stripe.tax_ids (_last_synced_at, _raw_data, _account_id) FROM stdin;
\.


--
-- Name: _sync_status_id_seq; Type: SEQUENCE SET; Schema: stripe; Owner: postgres
--

SELECT pg_catalog.setval('stripe._sync_status_id_seq', 1, false);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories categories_slug_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_unique UNIQUE (slug);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: payment_methods payment_methods_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_methods
    ADD CONSTRAINT payment_methods_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_slug_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_slug_unique UNIQUE (slug);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: _migrations _migrations_name_key; Type: CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe._migrations
    ADD CONSTRAINT _migrations_name_key UNIQUE (name);


--
-- Name: _migrations _migrations_pkey; Type: CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe._migrations
    ADD CONSTRAINT _migrations_pkey PRIMARY KEY (id);


--
-- Name: _sync_status _sync_status_pkey; Type: CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe._sync_status
    ADD CONSTRAINT _sync_status_pkey PRIMARY KEY (id);


--
-- Name: _sync_status _sync_status_resource_account_key; Type: CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe._sync_status
    ADD CONSTRAINT _sync_status_resource_account_key UNIQUE (resource, account_id);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: active_entitlements active_entitlements_pkey; Type: CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.active_entitlements
    ADD CONSTRAINT active_entitlements_pkey PRIMARY KEY (id);


--
-- Name: charges charges_pkey; Type: CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.charges
    ADD CONSTRAINT charges_pkey PRIMARY KEY (id);


--
-- Name: checkout_session_line_items checkout_session_line_items_pkey; Type: CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.checkout_session_line_items
    ADD CONSTRAINT checkout_session_line_items_pkey PRIMARY KEY (id);


--
-- Name: checkout_sessions checkout_sessions_pkey; Type: CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.checkout_sessions
    ADD CONSTRAINT checkout_sessions_pkey PRIMARY KEY (id);


--
-- Name: coupons coupons_pkey; Type: CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.coupons
    ADD CONSTRAINT coupons_pkey PRIMARY KEY (id);


--
-- Name: credit_notes credit_notes_pkey; Type: CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.credit_notes
    ADD CONSTRAINT credit_notes_pkey PRIMARY KEY (id);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: disputes disputes_pkey; Type: CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.disputes
    ADD CONSTRAINT disputes_pkey PRIMARY KEY (id);


--
-- Name: early_fraud_warnings early_fraud_warnings_pkey; Type: CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.early_fraud_warnings
    ADD CONSTRAINT early_fraud_warnings_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: features features_pkey; Type: CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.features
    ADD CONSTRAINT features_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: _managed_webhooks managed_webhooks_pkey; Type: CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe._managed_webhooks
    ADD CONSTRAINT managed_webhooks_pkey PRIMARY KEY (id);


--
-- Name: _managed_webhooks managed_webhooks_url_account_unique; Type: CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe._managed_webhooks
    ADD CONSTRAINT managed_webhooks_url_account_unique UNIQUE (url, account_id);


--
-- Name: payment_intents payment_intents_pkey; Type: CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.payment_intents
    ADD CONSTRAINT payment_intents_pkey PRIMARY KEY (id);


--
-- Name: payment_methods payment_methods_pkey; Type: CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.payment_methods
    ADD CONSTRAINT payment_methods_pkey PRIMARY KEY (id);


--
-- Name: payouts payouts_pkey; Type: CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.payouts
    ADD CONSTRAINT payouts_pkey PRIMARY KEY (id);


--
-- Name: plans plans_pkey; Type: CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.plans
    ADD CONSTRAINT plans_pkey PRIMARY KEY (id);


--
-- Name: prices prices_pkey; Type: CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.prices
    ADD CONSTRAINT prices_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: refunds refunds_pkey; Type: CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.refunds
    ADD CONSTRAINT refunds_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: setup_intents setup_intents_pkey; Type: CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.setup_intents
    ADD CONSTRAINT setup_intents_pkey PRIMARY KEY (id);


--
-- Name: subscription_items subscription_items_pkey; Type: CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.subscription_items
    ADD CONSTRAINT subscription_items_pkey PRIMARY KEY (id);


--
-- Name: subscription_schedules subscription_schedules_pkey; Type: CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.subscription_schedules
    ADD CONSTRAINT subscription_schedules_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: tax_ids tax_ids_pkey; Type: CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.tax_ids
    ADD CONSTRAINT tax_ids_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_session_expire" ON public.sessions USING btree (expire);


--
-- Name: cart_items_user_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cart_items_user_idx ON public.cart_items USING btree (user_id);


--
-- Name: order_items_order_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX order_items_order_idx ON public.order_items USING btree (order_id);


--
-- Name: orders_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX orders_status_idx ON public.orders USING btree (status);


--
-- Name: orders_user_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX orders_user_idx ON public.orders USING btree (user_id);


--
-- Name: products_brand_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_brand_idx ON public.products USING btree (brand);


--
-- Name: products_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_category_idx ON public.products USING btree (category_id);


--
-- Name: products_featured_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_featured_idx ON public.products USING btree (featured);


--
-- Name: reviews_product_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reviews_product_idx ON public.reviews USING btree (product_id);


--
-- Name: reviews_user_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reviews_user_idx ON public.reviews USING btree (user_id);


--
-- Name: active_entitlements_lookup_key_key; Type: INDEX; Schema: stripe; Owner: postgres
--

CREATE UNIQUE INDEX active_entitlements_lookup_key_key ON stripe.active_entitlements USING btree (lookup_key) WHERE (lookup_key IS NOT NULL);


--
-- Name: features_lookup_key_key; Type: INDEX; Schema: stripe; Owner: postgres
--

CREATE UNIQUE INDEX features_lookup_key_key ON stripe.features USING btree (lookup_key) WHERE (lookup_key IS NOT NULL);


--
-- Name: idx_accounts_api_key_hashes; Type: INDEX; Schema: stripe; Owner: postgres
--

CREATE INDEX idx_accounts_api_key_hashes ON stripe.accounts USING gin (api_key_hashes);


--
-- Name: idx_accounts_business_name; Type: INDEX; Schema: stripe; Owner: postgres
--

CREATE INDEX idx_accounts_business_name ON stripe.accounts USING btree (business_name);


--
-- Name: idx_sync_status_resource_account; Type: INDEX; Schema: stripe; Owner: postgres
--

CREATE INDEX idx_sync_status_resource_account ON stripe._sync_status USING btree (resource, account_id);


--
-- Name: stripe_active_entitlements_customer_idx; Type: INDEX; Schema: stripe; Owner: postgres
--

CREATE INDEX stripe_active_entitlements_customer_idx ON stripe.active_entitlements USING btree (customer);


--
-- Name: stripe_active_entitlements_feature_idx; Type: INDEX; Schema: stripe; Owner: postgres
--

CREATE INDEX stripe_active_entitlements_feature_idx ON stripe.active_entitlements USING btree (feature);


--
-- Name: stripe_checkout_session_line_items_price_idx; Type: INDEX; Schema: stripe; Owner: postgres
--

CREATE INDEX stripe_checkout_session_line_items_price_idx ON stripe.checkout_session_line_items USING btree (price);


--
-- Name: stripe_checkout_session_line_items_session_idx; Type: INDEX; Schema: stripe; Owner: postgres
--

CREATE INDEX stripe_checkout_session_line_items_session_idx ON stripe.checkout_session_line_items USING btree (checkout_session);


--
-- Name: stripe_checkout_sessions_customer_idx; Type: INDEX; Schema: stripe; Owner: postgres
--

CREATE INDEX stripe_checkout_sessions_customer_idx ON stripe.checkout_sessions USING btree (customer);


--
-- Name: stripe_checkout_sessions_invoice_idx; Type: INDEX; Schema: stripe; Owner: postgres
--

CREATE INDEX stripe_checkout_sessions_invoice_idx ON stripe.checkout_sessions USING btree (invoice);


--
-- Name: stripe_checkout_sessions_payment_intent_idx; Type: INDEX; Schema: stripe; Owner: postgres
--

CREATE INDEX stripe_checkout_sessions_payment_intent_idx ON stripe.checkout_sessions USING btree (payment_intent);


--
-- Name: stripe_checkout_sessions_subscription_idx; Type: INDEX; Schema: stripe; Owner: postgres
--

CREATE INDEX stripe_checkout_sessions_subscription_idx ON stripe.checkout_sessions USING btree (subscription);


--
-- Name: stripe_credit_notes_customer_idx; Type: INDEX; Schema: stripe; Owner: postgres
--

CREATE INDEX stripe_credit_notes_customer_idx ON stripe.credit_notes USING btree (customer);


--
-- Name: stripe_credit_notes_invoice_idx; Type: INDEX; Schema: stripe; Owner: postgres
--

CREATE INDEX stripe_credit_notes_invoice_idx ON stripe.credit_notes USING btree (invoice);


--
-- Name: stripe_dispute_created_idx; Type: INDEX; Schema: stripe; Owner: postgres
--

CREATE INDEX stripe_dispute_created_idx ON stripe.disputes USING btree (created);


--
-- Name: stripe_early_fraud_warnings_charge_idx; Type: INDEX; Schema: stripe; Owner: postgres
--

CREATE INDEX stripe_early_fraud_warnings_charge_idx ON stripe.early_fraud_warnings USING btree (charge);


--
-- Name: stripe_early_fraud_warnings_payment_intent_idx; Type: INDEX; Schema: stripe; Owner: postgres
--

CREATE INDEX stripe_early_fraud_warnings_payment_intent_idx ON stripe.early_fraud_warnings USING btree (payment_intent);


--
-- Name: stripe_invoices_customer_idx; Type: INDEX; Schema: stripe; Owner: postgres
--

CREATE INDEX stripe_invoices_customer_idx ON stripe.invoices USING btree (customer);


--
-- Name: stripe_invoices_subscription_idx; Type: INDEX; Schema: stripe; Owner: postgres
--

CREATE INDEX stripe_invoices_subscription_idx ON stripe.invoices USING btree (subscription);


--
-- Name: stripe_managed_webhooks_enabled_idx; Type: INDEX; Schema: stripe; Owner: postgres
--

CREATE INDEX stripe_managed_webhooks_enabled_idx ON stripe._managed_webhooks USING btree (enabled);


--
-- Name: stripe_managed_webhooks_status_idx; Type: INDEX; Schema: stripe; Owner: postgres
--

CREATE INDEX stripe_managed_webhooks_status_idx ON stripe._managed_webhooks USING btree (status);


--
-- Name: stripe_payment_intents_customer_idx; Type: INDEX; Schema: stripe; Owner: postgres
--

CREATE INDEX stripe_payment_intents_customer_idx ON stripe.payment_intents USING btree (customer);


--
-- Name: stripe_payment_intents_invoice_idx; Type: INDEX; Schema: stripe; Owner: postgres
--

CREATE INDEX stripe_payment_intents_invoice_idx ON stripe.payment_intents USING btree (invoice);


--
-- Name: stripe_payment_methods_customer_idx; Type: INDEX; Schema: stripe; Owner: postgres
--

CREATE INDEX stripe_payment_methods_customer_idx ON stripe.payment_methods USING btree (customer);


--
-- Name: stripe_refunds_charge_idx; Type: INDEX; Schema: stripe; Owner: postgres
--

CREATE INDEX stripe_refunds_charge_idx ON stripe.refunds USING btree (charge);


--
-- Name: stripe_refunds_payment_intent_idx; Type: INDEX; Schema: stripe; Owner: postgres
--

CREATE INDEX stripe_refunds_payment_intent_idx ON stripe.refunds USING btree (payment_intent);


--
-- Name: stripe_reviews_charge_idx; Type: INDEX; Schema: stripe; Owner: postgres
--

CREATE INDEX stripe_reviews_charge_idx ON stripe.reviews USING btree (charge);


--
-- Name: stripe_reviews_payment_intent_idx; Type: INDEX; Schema: stripe; Owner: postgres
--

CREATE INDEX stripe_reviews_payment_intent_idx ON stripe.reviews USING btree (payment_intent);


--
-- Name: stripe_setup_intents_customer_idx; Type: INDEX; Schema: stripe; Owner: postgres
--

CREATE INDEX stripe_setup_intents_customer_idx ON stripe.setup_intents USING btree (customer);


--
-- Name: stripe_tax_ids_customer_idx; Type: INDEX; Schema: stripe; Owner: postgres
--

CREATE INDEX stripe_tax_ids_customer_idx ON stripe.tax_ids USING btree (customer);


--
-- Name: _managed_webhooks handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: postgres
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe._managed_webhooks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_metadata();


--
-- Name: _sync_status handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: postgres
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe._sync_status FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_metadata();


--
-- Name: accounts handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: postgres
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.accounts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: active_entitlements handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: postgres
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.active_entitlements FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: charges handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: postgres
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.charges FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: checkout_session_line_items handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: postgres
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.checkout_session_line_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: checkout_sessions handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: postgres
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.checkout_sessions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: coupons handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: postgres
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.coupons FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: customers handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: postgres
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.customers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: disputes handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: postgres
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.disputes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: early_fraud_warnings handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: postgres
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.early_fraud_warnings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: events handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: postgres
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: features handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: postgres
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.features FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: invoices handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: postgres
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.invoices FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: payouts handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: postgres
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.payouts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: plans handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: postgres
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.plans FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: prices handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: postgres
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.prices FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: products handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: postgres
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: refunds handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: postgres
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.refunds FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: reviews handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: postgres
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.reviews FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: subscriptions handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: postgres
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.subscriptions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: cart_items cart_items_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: order_items order_items_order_id_orders_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_orders_id_fk FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: order_items order_items_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: products products_category_id_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_categories_id_fk FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: reviews reviews_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: active_entitlements fk_active_entitlements_account; Type: FK CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.active_entitlements
    ADD CONSTRAINT fk_active_entitlements_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: charges fk_charges_account; Type: FK CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.charges
    ADD CONSTRAINT fk_charges_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: checkout_session_line_items fk_checkout_session_line_items_account; Type: FK CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.checkout_session_line_items
    ADD CONSTRAINT fk_checkout_session_line_items_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: checkout_sessions fk_checkout_sessions_account; Type: FK CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.checkout_sessions
    ADD CONSTRAINT fk_checkout_sessions_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: credit_notes fk_credit_notes_account; Type: FK CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.credit_notes
    ADD CONSTRAINT fk_credit_notes_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: customers fk_customers_account; Type: FK CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.customers
    ADD CONSTRAINT fk_customers_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: disputes fk_disputes_account; Type: FK CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.disputes
    ADD CONSTRAINT fk_disputes_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: early_fraud_warnings fk_early_fraud_warnings_account; Type: FK CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.early_fraud_warnings
    ADD CONSTRAINT fk_early_fraud_warnings_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: features fk_features_account; Type: FK CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.features
    ADD CONSTRAINT fk_features_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: invoices fk_invoices_account; Type: FK CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.invoices
    ADD CONSTRAINT fk_invoices_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: _managed_webhooks fk_managed_webhooks_account; Type: FK CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe._managed_webhooks
    ADD CONSTRAINT fk_managed_webhooks_account FOREIGN KEY (account_id) REFERENCES stripe.accounts(id);


--
-- Name: payment_intents fk_payment_intents_account; Type: FK CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.payment_intents
    ADD CONSTRAINT fk_payment_intents_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: payment_methods fk_payment_methods_account; Type: FK CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.payment_methods
    ADD CONSTRAINT fk_payment_methods_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: plans fk_plans_account; Type: FK CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.plans
    ADD CONSTRAINT fk_plans_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: prices fk_prices_account; Type: FK CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.prices
    ADD CONSTRAINT fk_prices_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: products fk_products_account; Type: FK CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.products
    ADD CONSTRAINT fk_products_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: refunds fk_refunds_account; Type: FK CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.refunds
    ADD CONSTRAINT fk_refunds_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: reviews fk_reviews_account; Type: FK CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.reviews
    ADD CONSTRAINT fk_reviews_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: setup_intents fk_setup_intents_account; Type: FK CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.setup_intents
    ADD CONSTRAINT fk_setup_intents_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: subscription_items fk_subscription_items_account; Type: FK CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.subscription_items
    ADD CONSTRAINT fk_subscription_items_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: subscription_schedules fk_subscription_schedules_account; Type: FK CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.subscription_schedules
    ADD CONSTRAINT fk_subscription_schedules_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: subscriptions fk_subscriptions_account; Type: FK CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.subscriptions
    ADD CONSTRAINT fk_subscriptions_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: _sync_status fk_sync_status_account; Type: FK CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe._sync_status
    ADD CONSTRAINT fk_sync_status_account FOREIGN KEY (account_id) REFERENCES stripe.accounts(id);


--
-- Name: tax_ids fk_tax_ids_account; Type: FK CONSTRAINT; Schema: stripe; Owner: postgres
--

ALTER TABLE ONLY stripe.tax_ids
    ADD CONSTRAINT fk_tax_ids_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- PostgreSQL database dump complete
--

\unrestrict XoXzXH6Jnr0C203wotZatDxgR0XhuSA6EN0ZhWj8gwooL9N3falJamlQhI81ZmZ

