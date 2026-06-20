--
-- PostgreSQL database dump
--

-- Dumped from database version 13.7
-- Dumped by pg_dump version 13.7

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: auth_group; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.auth_group (
    id integer NOT NULL,
    name character varying(150) NOT NULL
);


ALTER TABLE public.auth_group OWNER TO decdpdev;

--
-- Name: auth_group_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public.auth_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_group_id_seq OWNER TO decdpdev;

--
-- Name: auth_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public.auth_group_id_seq OWNED BY public.auth_group.id;


--
-- Name: auth_group_permissions; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.auth_group_permissions (
    id bigint NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.auth_group_permissions OWNER TO decdpdev;

--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public.auth_group_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_group_permissions_id_seq OWNER TO decdpdev;

--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public.auth_group_permissions_id_seq OWNED BY public.auth_group_permissions.id;


--
-- Name: auth_permission; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.auth_permission (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);


ALTER TABLE public.auth_permission OWNER TO decdpdev;

--
-- Name: auth_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public.auth_permission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_permission_id_seq OWNER TO decdpdev;

--
-- Name: auth_permission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public.auth_permission_id_seq OWNED BY public.auth_permission.id;


--
-- Name: auth_user; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.auth_user (
    id integer NOT NULL,
    password character varying(128) NOT NULL,
    last_login timestamp with time zone,
    is_superuser boolean NOT NULL,
    username character varying(150) NOT NULL,
    first_name character varying(150) NOT NULL,
    last_name character varying(150) NOT NULL,
    email character varying(254) NOT NULL,
    is_staff boolean NOT NULL,
    is_active boolean NOT NULL,
    date_joined timestamp with time zone NOT NULL
);


ALTER TABLE public.auth_user OWNER TO decdpdev;

--
-- Name: auth_user_groups; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.auth_user_groups (
    id bigint NOT NULL,
    user_id integer NOT NULL,
    group_id integer NOT NULL
);


ALTER TABLE public.auth_user_groups OWNER TO decdpdev;

--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public.auth_user_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_groups_id_seq OWNER TO decdpdev;

--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public.auth_user_groups_id_seq OWNED BY public.auth_user_groups.id;


--
-- Name: auth_user_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public.auth_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_id_seq OWNER TO decdpdev;

--
-- Name: auth_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public.auth_user_id_seq OWNED BY public.auth_user.id;


--
-- Name: auth_user_user_permissions; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.auth_user_user_permissions (
    id bigint NOT NULL,
    user_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.auth_user_user_permissions OWNER TO decdpdev;

--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public.auth_user_user_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_user_permissions_id_seq OWNER TO decdpdev;

--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public.auth_user_user_permissions_id_seq OWNED BY public.auth_user_user_permissions.id;


--
-- Name: django_admin_log; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.django_admin_log (
    id integer NOT NULL,
    action_time timestamp with time zone NOT NULL,
    object_id text,
    object_repr character varying(200) NOT NULL,
    action_flag smallint NOT NULL,
    change_message text NOT NULL,
    content_type_id integer,
    user_id integer NOT NULL,
    CONSTRAINT django_admin_log_action_flag_check CHECK ((action_flag >= 0))
);


ALTER TABLE public.django_admin_log OWNER TO decdpdev;

--
-- Name: django_admin_log_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public.django_admin_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_admin_log_id_seq OWNER TO decdpdev;

--
-- Name: django_admin_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public.django_admin_log_id_seq OWNED BY public.django_admin_log.id;


--
-- Name: django_celery_beat_clockedschedule; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.django_celery_beat_clockedschedule (
    id integer NOT NULL,
    clocked_time timestamp with time zone NOT NULL
);


ALTER TABLE public.django_celery_beat_clockedschedule OWNER TO decdpdev;

--
-- Name: django_celery_beat_clockedschedule_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public.django_celery_beat_clockedschedule_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_celery_beat_clockedschedule_id_seq OWNER TO decdpdev;

--
-- Name: django_celery_beat_clockedschedule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public.django_celery_beat_clockedschedule_id_seq OWNED BY public.django_celery_beat_clockedschedule.id;


--
-- Name: django_celery_beat_crontabschedule; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.django_celery_beat_crontabschedule (
    id integer NOT NULL,
    minute character varying(240) NOT NULL,
    hour character varying(96) NOT NULL,
    day_of_week character varying(64) NOT NULL,
    day_of_month character varying(124) NOT NULL,
    month_of_year character varying(64) NOT NULL,
    timezone character varying(63) NOT NULL
);


ALTER TABLE public.django_celery_beat_crontabschedule OWNER TO decdpdev;

--
-- Name: django_celery_beat_crontabschedule_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public.django_celery_beat_crontabschedule_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_celery_beat_crontabschedule_id_seq OWNER TO decdpdev;

--
-- Name: django_celery_beat_crontabschedule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public.django_celery_beat_crontabschedule_id_seq OWNED BY public.django_celery_beat_crontabschedule.id;


--
-- Name: django_celery_beat_intervalschedule; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.django_celery_beat_intervalschedule (
    id integer NOT NULL,
    every integer NOT NULL,
    period character varying(24) NOT NULL
);


ALTER TABLE public.django_celery_beat_intervalschedule OWNER TO decdpdev;

--
-- Name: django_celery_beat_intervalschedule_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public.django_celery_beat_intervalschedule_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_celery_beat_intervalschedule_id_seq OWNER TO decdpdev;

--
-- Name: django_celery_beat_intervalschedule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public.django_celery_beat_intervalschedule_id_seq OWNED BY public.django_celery_beat_intervalschedule.id;


--
-- Name: django_celery_beat_periodictask; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.django_celery_beat_periodictask (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    task character varying(200) NOT NULL,
    args text NOT NULL,
    kwargs text NOT NULL,
    queue character varying(200),
    exchange character varying(200),
    routing_key character varying(200),
    expires timestamp with time zone,
    enabled boolean NOT NULL,
    last_run_at timestamp with time zone,
    total_run_count integer NOT NULL,
    date_changed timestamp with time zone NOT NULL,
    description text NOT NULL,
    crontab_id integer,
    interval_id integer,
    solar_id integer,
    one_off boolean NOT NULL,
    start_time timestamp with time zone,
    priority integer,
    headers text NOT NULL,
    clocked_id integer,
    expire_seconds integer,
    CONSTRAINT django_celery_beat_periodictask_expire_seconds_check CHECK ((expire_seconds >= 0)),
    CONSTRAINT django_celery_beat_periodictask_priority_check CHECK ((priority >= 0)),
    CONSTRAINT django_celery_beat_periodictask_total_run_count_check CHECK ((total_run_count >= 0))
);


ALTER TABLE public.django_celery_beat_periodictask OWNER TO decdpdev;

--
-- Name: django_celery_beat_periodictask_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public.django_celery_beat_periodictask_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_celery_beat_periodictask_id_seq OWNER TO decdpdev;

--
-- Name: django_celery_beat_periodictask_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public.django_celery_beat_periodictask_id_seq OWNED BY public.django_celery_beat_periodictask.id;


--
-- Name: django_celery_beat_periodictasks; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.django_celery_beat_periodictasks (
    ident smallint NOT NULL,
    last_update timestamp with time zone NOT NULL
);


ALTER TABLE public.django_celery_beat_periodictasks OWNER TO decdpdev;

--
-- Name: django_celery_beat_solarschedule; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.django_celery_beat_solarschedule (
    id integer NOT NULL,
    event character varying(24) NOT NULL,
    latitude numeric(9,6) NOT NULL,
    longitude numeric(9,6) NOT NULL
);


ALTER TABLE public.django_celery_beat_solarschedule OWNER TO decdpdev;

--
-- Name: django_celery_beat_solarschedule_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public.django_celery_beat_solarschedule_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_celery_beat_solarschedule_id_seq OWNER TO decdpdev;

--
-- Name: django_celery_beat_solarschedule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public.django_celery_beat_solarschedule_id_seq OWNED BY public.django_celery_beat_solarschedule.id;


--
-- Name: django_content_type; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.django_content_type (
    id integer NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);


ALTER TABLE public.django_content_type OWNER TO decdpdev;

--
-- Name: django_content_type_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public.django_content_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_content_type_id_seq OWNER TO decdpdev;

--
-- Name: django_content_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public.django_content_type_id_seq OWNED BY public.django_content_type.id;


--
-- Name: django_migrations; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.django_migrations (
    id bigint NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);


ALTER TABLE public.django_migrations OWNER TO decdpdev;

--
-- Name: django_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public.django_migrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_migrations_id_seq OWNER TO decdpdev;

--
-- Name: django_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public.django_migrations_id_seq OWNED BY public.django_migrations.id;


--
-- Name: django_session; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);


ALTER TABLE public.django_session OWNER TO decdpdev;

--
-- Name: ge_api_cde; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.ge_api_cde (
    id bigint NOT NULL,
    field_name character varying(100) NOT NULL,
    description text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    project_id_id bigint NOT NULL
);


ALTER TABLE public.ge_api_cde OWNER TO decdpdev;

--
-- Name: ge_api_cde_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public.ge_api_cde_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ge_api_cde_id_seq OWNER TO decdpdev;

--
-- Name: ge_api_cde_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public.ge_api_cde_id_seq OWNED BY public.ge_api_cde.id;


--
-- Name: ge_api_dataprofile; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.ge_api_dataprofile (
    id bigint NOT NULL,
    dataset character varying(100) NOT NULL,
    ref_datasets text NOT NULL,
    fields text NOT NULL,
    total_records integer NOT NULL,
    report text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    datasource_id_id bigint NOT NULL
);


ALTER TABLE public.ge_api_dataprofile OWNER TO decdpdev;

--
-- Name: ge_api_dataprofile_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public.ge_api_dataprofile_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ge_api_dataprofile_id_seq OWNER TO decdpdev;

--
-- Name: ge_api_dataprofile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public.ge_api_dataprofile_id_seq OWNED BY public.ge_api_dataprofile.id;


--
-- Name: ge_api_datasource; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.ge_api_datasource (
    id bigint NOT NULL,
    user_id character varying(40) NOT NULL,
    name character varying(100) NOT NULL,
    type character varying(40) NOT NULL,
    source character varying(100) NOT NULL,
    credentials text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.ge_api_datasource OWNER TO decdpdev;

--
-- Name: ge_api_datasource_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public.ge_api_datasource_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ge_api_datasource_id_seq OWNER TO decdpdev;

--
-- Name: ge_api_datasource_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public.ge_api_datasource_id_seq OWNED BY public.ge_api_datasource.id;


--
-- Name: ge_api_dqdimension; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.ge_api_dqdimension (
    id bigint NOT NULL,
    name character varying(100) NOT NULL,
    description text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.ge_api_dqdimension OWNER TO decdpdev;

--
-- Name: ge_api_dqdimension_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public.ge_api_dqdimension_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ge_api_dqdimension_id_seq OWNER TO decdpdev;

--
-- Name: ge_api_dqdimension_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public.ge_api_dqdimension_id_seq OWNED BY public.ge_api_dqdimension.id;


--
-- Name: ge_api_execution; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.ge_api_execution (
    id bigint NOT NULL,
    name character varying(100) NOT NULL,
    status character varying(20) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    project_id_id bigint NOT NULL
);


ALTER TABLE public.ge_api_execution OWNER TO decdpdev;

--
-- Name: ge_api_execution_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public.ge_api_execution_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ge_api_execution_id_seq OWNER TO decdpdev;

--
-- Name: ge_api_execution_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public.ge_api_execution_id_seq OWNED BY public.ge_api_execution.id;


--
-- Name: ge_api_project; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.ge_api_project (
    id bigint NOT NULL,
    name character varying(100) NOT NULL,
    dataset character varying(100) NOT NULL,
    ref_datasets text NOT NULL,
    description text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    datasource_id_id bigint NOT NULL
);


ALTER TABLE public.ge_api_project OWNER TO decdpdev;

--
-- Name: ge_api_project_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public.ge_api_project_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ge_api_project_id_seq OWNER TO decdpdev;

--
-- Name: ge_api_project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public.ge_api_project_id_seq OWNED BY public.ge_api_project.id;


--
-- Name: ge_api_report; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.ge_api_report (
    id bigint NOT NULL,
    tenant_id character varying(40),
    execution_start timestamp with time zone NOT NULL,
    execution_end timestamp with time zone,
    datasource_name character varying(100) NOT NULL,
    rule_name character varying(100) NOT NULL,
    run_name character varying(100),
    checkpoint_name character varying(100),
    source_dataset character varying(100),
    target_dataset character varying(100) NOT NULL,
    rows_processed integer NOT NULL,
    rows_passed integer NOT NULL,
    rows_failed integer NOT NULL,
    results text,
    statistics text,
    success boolean,
    complete_result_url character varying(200)
);


ALTER TABLE public.ge_api_report OWNER TO decdpdev;

--
-- Name: ge_api_report_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public.ge_api_report_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ge_api_report_id_seq OWNER TO decdpdev;

--
-- Name: ge_api_report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public.ge_api_report_id_seq OWNED BY public.ge_api_report.id;


--
-- Name: ge_api_result; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.ge_api_result (
    id bigint NOT NULL,
    total_records integer NOT NULL,
    records_passed integer NOT NULL,
    records_failed integer NOT NULL,
    p_records_passed double precision NOT NULL,
    p_records_failed double precision NOT NULL,
    result_status boolean NOT NULL,
    json_result text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    rule_id_id bigint NOT NULL,
    execution_id_id bigint NOT NULL
);


ALTER TABLE public.ge_api_result OWNER TO decdpdev;

--
-- Name: ge_api_result_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public.ge_api_result_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ge_api_result_id_seq OWNER TO decdpdev;

--
-- Name: ge_api_result_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public.ge_api_result_id_seq OWNED BY public.ge_api_result.id;


--
-- Name: ge_api_resultv1; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.ge_api_resultv1 (
    id bigint NOT NULL,
    datasource_name character varying(100) NOT NULL,
    dataset_name character varying(100) NOT NULL,
    expectation_suite_name character varying(100) NOT NULL,
    run_name character varying(100) NOT NULL,
    expectation_name character varying(100) NOT NULL,
    dq_dimension character varying(100) NOT NULL,
    result_status boolean NOT NULL,
    result_json text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    expectation_config text NOT NULL,
    cde_name character varying(100) NOT NULL
);


ALTER TABLE public.ge_api_resultv1 OWNER TO decdpdev;

--
-- Name: ge_api_resultv1_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public.ge_api_resultv1_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ge_api_resultv1_id_seq OWNER TO decdpdev;

--
-- Name: ge_api_resultv1_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public.ge_api_resultv1_id_seq OWNED BY public.ge_api_resultv1.id;


--
-- Name: ge_api_rule; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.ge_api_rule (
    id bigint NOT NULL,
    name character varying(100) NOT NULL,
    json text NOT NULL,
    threshold double precision NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    cde_id_id bigint NOT NULL,
    rule_model_id_id bigint NOT NULL
);


ALTER TABLE public.ge_api_rule OWNER TO decdpdev;

--
-- Name: ge_api_rule_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public.ge_api_rule_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ge_api_rule_id_seq OWNER TO decdpdev;

--
-- Name: ge_api_rule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public.ge_api_rule_id_seq OWNED BY public.ge_api_rule.id;


--
-- Name: ge_api_rulemodel; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.ge_api_rulemodel (
    id bigint NOT NULL,
    name character varying(100) NOT NULL,
    json text NOT NULL,
    example text NOT NULL,
    default_threshold double precision NOT NULL,
    description text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    dq_dimension_id_id bigint NOT NULL
);


ALTER TABLE public.ge_api_rulemodel OWNER TO decdpdev;

--
-- Name: ge_api_rulemodel_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public.ge_api_rulemodel_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ge_api_rulemodel_id_seq OWNER TO decdpdev;

--
-- Name: ge_api_rulemodel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public.ge_api_rulemodel_id_seq OWNED BY public.ge_api_rulemodel.id;


--
-- Name: ge_checkpoint_store; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.ge_checkpoint_store (
    checkpoint_name character varying NOT NULL,
    value character varying
);


ALTER TABLE public.ge_checkpoint_store OWNER TO decdpdev;

--
-- Name: ge_datasources_store; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.ge_datasources_store (
    datasource_name character varying(100) NOT NULL,
    type character varying,
    json character varying,
    value character varying NOT NULL
);


ALTER TABLE public.ge_datasources_store OWNER TO decdpdev;

--
-- Name: ge_expectations_store; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.ge_expectations_store (
    expectation_suite_name character varying NOT NULL,
    value character varying
);


ALTER TABLE public.ge_expectations_store OWNER TO decdpdev;

--
-- Name: ge_validations_store; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.ge_validations_store (
    expectation_suite_name character varying NOT NULL,
    run_name character varying NOT NULL,
    run_time character varying NOT NULL,
    batch_identifier character varying NOT NULL,
    value character varying
);


ALTER TABLE public.ge_validations_store OWNER TO decdpdev;

--
-- Name: stream_checkpoints; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.stream_checkpoints (
    checkpoint_name character varying,
    datasource_name character varying,
    expectation_suite_name character varying,
    status bit(1) DEFAULT (0)::bit(1)
);


ALTER TABLE public.stream_checkpoints OWNER TO decdpdev;

--
-- Name: stream_validations_store; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.stream_validations_store (
    checkpoint_name character varying(100) NOT NULL,
    element_count integer,
    unexpected_count integer,
    value character varying NOT NULL
);


ALTER TABLE public.stream_validations_store OWNER TO decdpdev;

--
-- Name: wizard_flow_data; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.wizard_flow_data (
    id integer NOT NULL,
    status character varying,
    current_page character varying,
    datasource_name character varying,
    data_assets character varying,
    asset_for_profile character varying,
    all_columns character varying,
    selected_ce character varying,
    expectation_suite_name character varying,
    suite_config character varying,
    run_name character varying
);


ALTER TABLE public.wizard_flow_data OWNER TO decdpdev;

--
-- Name: wizard_flow_data_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public.wizard_flow_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.wizard_flow_data_id_seq OWNER TO decdpdev;

--
-- Name: wizard_flow_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public.wizard_flow_data_id_seq OWNED BY public.wizard_flow_data.id;


--
-- Name: auth_group id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.auth_group ALTER COLUMN id SET DEFAULT nextval('public.auth_group_id_seq'::regclass);


--
-- Name: auth_group_permissions id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.auth_group_permissions ALTER COLUMN id SET DEFAULT nextval('public.auth_group_permissions_id_seq'::regclass);


--
-- Name: auth_permission id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.auth_permission ALTER COLUMN id SET DEFAULT nextval('public.auth_permission_id_seq'::regclass);


--
-- Name: auth_user id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.auth_user ALTER COLUMN id SET DEFAULT nextval('public.auth_user_id_seq'::regclass);


--
-- Name: auth_user_groups id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.auth_user_groups ALTER COLUMN id SET DEFAULT nextval('public.auth_user_groups_id_seq'::regclass);


--
-- Name: auth_user_user_permissions id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.auth_user_user_permissions ALTER COLUMN id SET DEFAULT nextval('public.auth_user_user_permissions_id_seq'::regclass);


--
-- Name: django_admin_log id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.django_admin_log ALTER COLUMN id SET DEFAULT nextval('public.django_admin_log_id_seq'::regclass);


--
-- Name: django_celery_beat_clockedschedule id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.django_celery_beat_clockedschedule ALTER COLUMN id SET DEFAULT nextval('public.django_celery_beat_clockedschedule_id_seq'::regclass);


--
-- Name: django_celery_beat_crontabschedule id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.django_celery_beat_crontabschedule ALTER COLUMN id SET DEFAULT nextval('public.django_celery_beat_crontabschedule_id_seq'::regclass);


--
-- Name: django_celery_beat_intervalschedule id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.django_celery_beat_intervalschedule ALTER COLUMN id SET DEFAULT nextval('public.django_celery_beat_intervalschedule_id_seq'::regclass);


--
-- Name: django_celery_beat_periodictask id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.django_celery_beat_periodictask ALTER COLUMN id SET DEFAULT nextval('public.django_celery_beat_periodictask_id_seq'::regclass);


--
-- Name: django_celery_beat_solarschedule id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.django_celery_beat_solarschedule ALTER COLUMN id SET DEFAULT nextval('public.django_celery_beat_solarschedule_id_seq'::regclass);


--
-- Name: django_content_type id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.django_content_type ALTER COLUMN id SET DEFAULT nextval('public.django_content_type_id_seq'::regclass);


--
-- Name: django_migrations id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.django_migrations ALTER COLUMN id SET DEFAULT nextval('public.django_migrations_id_seq'::regclass);


--
-- Name: ge_api_cde id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_api_cde ALTER COLUMN id SET DEFAULT nextval('public.ge_api_cde_id_seq'::regclass);


--
-- Name: ge_api_dataprofile id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_api_dataprofile ALTER COLUMN id SET DEFAULT nextval('public.ge_api_dataprofile_id_seq'::regclass);


--
-- Name: ge_api_datasource id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_api_datasource ALTER COLUMN id SET DEFAULT nextval('public.ge_api_datasource_id_seq'::regclass);


--
-- Name: ge_api_dqdimension id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_api_dqdimension ALTER COLUMN id SET DEFAULT nextval('public.ge_api_dqdimension_id_seq'::regclass);


--
-- Name: ge_api_execution id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_api_execution ALTER COLUMN id SET DEFAULT nextval('public.ge_api_execution_id_seq'::regclass);


--
-- Name: ge_api_project id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_api_project ALTER COLUMN id SET DEFAULT nextval('public.ge_api_project_id_seq'::regclass);


--
-- Name: ge_api_report id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_api_report ALTER COLUMN id SET DEFAULT nextval('public.ge_api_report_id_seq'::regclass);


--
-- Name: ge_api_result id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_api_result ALTER COLUMN id SET DEFAULT nextval('public.ge_api_result_id_seq'::regclass);


--
-- Name: ge_api_resultv1 id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_api_resultv1 ALTER COLUMN id SET DEFAULT nextval('public.ge_api_resultv1_id_seq'::regclass);


--
-- Name: ge_api_rule id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_api_rule ALTER COLUMN id SET DEFAULT nextval('public.ge_api_rule_id_seq'::regclass);


--
-- Name: ge_api_rulemodel id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_api_rulemodel ALTER COLUMN id SET DEFAULT nextval('public.ge_api_rulemodel_id_seq'::regclass);


--
-- Name: wizard_flow_data id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.wizard_flow_data ALTER COLUMN id SET DEFAULT nextval('public.wizard_flow_data_id_seq'::regclass);


--
-- Data for Name: auth_group; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.auth_group (id, name) FROM stdin;
\.


--
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.auth_group_permissions (id, group_id, permission_id) FROM stdin;
\.


--
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.auth_permission (id, name, content_type_id, codename) FROM stdin;
1	Can add log entry	1	add_logentry
2	Can change log entry	1	change_logentry
3	Can delete log entry	1	delete_logentry
4	Can view log entry	1	view_logentry
5	Can add permission	2	add_permission
6	Can change permission	2	change_permission
7	Can delete permission	2	delete_permission
8	Can view permission	2	view_permission
9	Can add group	3	add_group
10	Can change group	3	change_group
11	Can delete group	3	delete_group
12	Can view group	3	view_group
13	Can add user	4	add_user
14	Can change user	4	change_user
15	Can delete user	4	delete_user
16	Can view user	4	view_user
17	Can add content type	5	add_contenttype
18	Can change content type	5	change_contenttype
19	Can delete content type	5	delete_contenttype
20	Can view content type	5	view_contenttype
21	Can add session	6	add_session
22	Can change session	6	change_session
23	Can delete session	6	delete_session
24	Can view session	6	view_session
25	Can add report	7	add_report
26	Can change report	7	change_report
27	Can delete report	7	delete_report
28	Can view report	7	view_report
29	Can add cde	8	add_cde
30	Can change cde	8	change_cde
31	Can delete cde	8	delete_cde
32	Can view cde	8	view_cde
33	Can add datasource	9	add_datasource
34	Can change datasource	9	change_datasource
35	Can delete datasource	9	delete_datasource
36	Can view datasource	9	view_datasource
37	Can add dq dimension	10	add_dqdimension
38	Can change dq dimension	10	change_dqdimension
39	Can delete dq dimension	10	delete_dqdimension
40	Can view dq dimension	10	view_dqdimension
41	Can add project	11	add_project
42	Can change project	11	change_project
43	Can delete project	11	delete_project
44	Can view project	11	view_project
45	Can add rule model	12	add_rulemodel
46	Can change rule model	12	change_rulemodel
47	Can delete rule model	12	delete_rulemodel
48	Can view rule model	12	view_rulemodel
49	Can add rule	13	add_rule
50	Can change rule	13	change_rule
51	Can delete rule	13	delete_rule
52	Can view rule	13	view_rule
53	Can add result	14	add_result
54	Can change result	14	change_result
55	Can delete result	14	delete_result
56	Can view result	14	view_result
57	Can add data profile	15	add_dataprofile
58	Can change data profile	15	change_dataprofile
59	Can delete data profile	15	delete_dataprofile
60	Can view data profile	15	view_dataprofile
61	Can add execution	16	add_execution
62	Can change execution	16	change_execution
63	Can delete execution	16	delete_execution
64	Can view execution	16	view_execution
65	Can add result v1	17	add_resultv1
66	Can change result v1	17	change_resultv1
67	Can delete result v1	17	delete_resultv1
68	Can view result v1	17	view_resultv1
69	Can add crontab	18	add_crontabschedule
70	Can change crontab	18	change_crontabschedule
71	Can delete crontab	18	delete_crontabschedule
72	Can view crontab	18	view_crontabschedule
73	Can add interval	19	add_intervalschedule
74	Can change interval	19	change_intervalschedule
75	Can delete interval	19	delete_intervalschedule
76	Can view interval	19	view_intervalschedule
77	Can add periodic task	20	add_periodictask
78	Can change periodic task	20	change_periodictask
79	Can delete periodic task	20	delete_periodictask
80	Can view periodic task	20	view_periodictask
81	Can add periodic tasks	21	add_periodictasks
82	Can change periodic tasks	21	change_periodictasks
83	Can delete periodic tasks	21	delete_periodictasks
84	Can view periodic tasks	21	view_periodictasks
85	Can add solar event	22	add_solarschedule
86	Can change solar event	22	change_solarschedule
87	Can delete solar event	22	delete_solarschedule
88	Can view solar event	22	view_solarschedule
89	Can add clocked	23	add_clockedschedule
90	Can change clocked	23	change_clockedschedule
91	Can delete clocked	23	delete_clockedschedule
92	Can view clocked	23	view_clockedschedule
\.


--
-- Data for Name: auth_user; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined) FROM stdin;
\.


--
-- Data for Name: auth_user_groups; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.auth_user_groups (id, user_id, group_id) FROM stdin;
\.


--
-- Data for Name: auth_user_user_permissions; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.auth_user_user_permissions (id, user_id, permission_id) FROM stdin;
\.


--
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.django_admin_log (id, action_time, object_id, object_repr, action_flag, change_message, content_type_id, user_id) FROM stdin;
\.


--
-- Data for Name: django_celery_beat_clockedschedule; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.django_celery_beat_clockedschedule (id, clocked_time) FROM stdin;
\.


--
-- Data for Name: django_celery_beat_crontabschedule; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.django_celery_beat_crontabschedule (id, minute, hour, day_of_week, day_of_month, month_of_year, timezone) FROM stdin;
\.


--
-- Data for Name: django_celery_beat_intervalschedule; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.django_celery_beat_intervalschedule (id, every, period) FROM stdin;
\.


--
-- Data for Name: django_celery_beat_periodictask; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.django_celery_beat_periodictask (id, name, task, args, kwargs, queue, exchange, routing_key, expires, enabled, last_run_at, total_run_count, date_changed, description, crontab_id, interval_id, solar_id, one_off, start_time, priority, headers, clocked_id, expire_seconds) FROM stdin;
\.


--
-- Data for Name: django_celery_beat_periodictasks; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.django_celery_beat_periodictasks (ident, last_update) FROM stdin;
\.


--
-- Data for Name: django_celery_beat_solarschedule; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.django_celery_beat_solarschedule (id, event, latitude, longitude) FROM stdin;
\.


--
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.django_content_type (id, app_label, model) FROM stdin;
1	admin	logentry
2	auth	permission
3	auth	group
4	auth	user
5	contenttypes	contenttype
6	sessions	session
7	ge_api	report
8	ge_api	cde
9	ge_api	datasource
10	ge_api	dqdimension
11	ge_api	project
12	ge_api	rulemodel
13	ge_api	rule
14	ge_api	result
15	ge_api	dataprofile
16	ge_api	execution
17	ge_api	resultv1
18	django_celery_beat	crontabschedule
19	django_celery_beat	intervalschedule
20	django_celery_beat	periodictask
21	django_celery_beat	periodictasks
22	django_celery_beat	solarschedule
23	django_celery_beat	clockedschedule
\.


--
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.django_migrations (id, app, name, applied) FROM stdin;
1	contenttypes	0001_initial	2022-06-14 10:38:35.162029+00
2	auth	0001_initial	2022-06-14 10:38:42.143425+00
3	admin	0001_initial	2022-06-14 10:38:44.163964+00
4	admin	0002_logentry_remove_auto_add	2022-06-14 10:38:44.828098+00
5	admin	0003_logentry_add_action_flag_choices	2022-06-14 10:38:45.713844+00
6	contenttypes	0002_remove_content_type_name	2022-06-14 10:38:47.038381+00
7	auth	0002_alter_permission_name_max_length	2022-06-14 10:38:48.130603+00
8	auth	0003_alter_user_email_max_length	2022-06-14 10:38:49.235484+00
9	auth	0004_alter_user_username_opts	2022-06-14 10:38:50.117762+00
10	auth	0005_alter_user_last_login_null	2022-06-14 10:38:51.2223+00
11	auth	0006_require_contenttypes_0002	2022-06-14 10:38:52.102034+00
12	auth	0007_alter_validators_add_error_messages	2022-06-14 10:38:52.982393+00
13	auth	0008_alter_user_username_max_length	2022-06-14 10:38:54.080373+00
14	auth	0009_alter_user_last_name_max_length	2022-06-14 10:38:55.184891+00
15	auth	0010_alter_group_name_max_length	2022-06-14 10:38:56.297628+00
16	auth	0011_update_proxy_permissions	2022-06-14 10:38:57.176863+00
17	auth	0012_alter_user_first_name_max_length	2022-06-14 10:38:58.278941+00
18	django_celery_beat	0001_initial	2022-06-14 10:39:01.422522+00
19	django_celery_beat	0002_auto_20161118_0346	2022-06-14 10:39:02.986507+00
20	django_celery_beat	0003_auto_20161209_0049	2022-06-14 10:39:03.874818+00
21	django_celery_beat	0004_auto_20170221_0000	2022-06-14 10:39:04.754635+00
22	django_celery_beat	0005_add_solarschedule_events_choices	2022-06-14 10:39:05.62278+00
23	django_celery_beat	0006_auto_20180322_0932	2022-06-14 10:39:07.626471+00
24	django_celery_beat	0007_auto_20180521_0826	2022-06-14 10:39:09.175211+00
25	django_celery_beat	0008_auto_20180914_1922	2022-06-14 10:39:10.065257+00
26	django_celery_beat	0006_auto_20180210_1226	2022-06-14 10:39:10.948673+00
27	django_celery_beat	0006_periodictask_priority	2022-06-14 10:39:12.047948+00
28	django_celery_beat	0009_periodictask_headers	2022-06-14 10:39:13.354398+00
29	django_celery_beat	0010_auto_20190429_0326	2022-06-14 10:39:14.342563+00
30	django_celery_beat	0011_auto_20190508_0153	2022-06-14 10:39:16.112572+00
31	django_celery_beat	0012_periodictask_expire_seconds	2022-06-14 10:39:17.00062+00
32	django_celery_beat	0013_auto_20200609_0727	2022-06-14 10:39:17.88182+00
33	django_celery_beat	0014_remove_clockedschedule_enabled	2022-06-14 10:39:18.979729+00
34	django_celery_beat	0015_edit_solarschedule_events_choices	2022-06-14 10:39:19.860487+00
35	ge_api	0001_initial	2022-06-14 10:39:20.975965+00
36	ge_api	0002_alter_report_execution_start	2022-06-14 10:39:21.857417+00
37	ge_api	0003_auto_20220307_1150	2022-06-14 10:39:28.49889+00
38	ge_api	0004_auto_20220307_1444	2022-06-14 10:39:31.629897+00
39	ge_api	0005_auto_20220307_1628	2022-06-14 10:39:32.295799+00
40	ge_api	0006_alter_rule_json	2022-06-14 10:39:33.180296+00
41	ge_api	0007_resultv1	2022-06-14 10:39:34.293684+00
42	ge_api	0008_auto_20220308_0839	2022-06-14 10:39:35.612427+00
43	ge_api	0009_resultv1_cde_name	2022-06-14 10:39:36.930389+00
44	sessions	0001_initial	2022-06-14 10:39:38.71658+00
45	django_celery_beat	0016_alter_crontabschedule_timezone	2022-08-03 07:37:11.663718+00
\.


--
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.django_session (session_key, session_data, expire_date) FROM stdin;
\.


--
-- Data for Name: ge_api_cde; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.ge_api_cde (id, field_name, description, created_at, updated_at, project_id_id) FROM stdin;
\.


--
-- Data for Name: ge_api_dataprofile; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.ge_api_dataprofile (id, dataset, ref_datasets, fields, total_records, report, created_at, updated_at, datasource_id_id) FROM stdin;
\.


--
-- Data for Name: ge_api_datasource; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.ge_api_datasource (id, user_id, name, type, source, credentials, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: ge_api_dqdimension; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.ge_api_dqdimension (id, name, description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: ge_api_execution; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.ge_api_execution (id, name, status, created_at, updated_at, project_id_id) FROM stdin;
\.


--
-- Data for Name: ge_api_project; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.ge_api_project (id, name, dataset, ref_datasets, description, created_at, updated_at, datasource_id_id) FROM stdin;
\.


--
-- Data for Name: ge_api_report; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.ge_api_report (id, tenant_id, execution_start, execution_end, datasource_name, rule_name, run_name, checkpoint_name, source_dataset, target_dataset, rows_processed, rows_passed, rows_failed, results, statistics, success, complete_result_url) FROM stdin;
5	\N	2022-06-16 11:51:30.432606+00	2022-06-16 11:51:46.548977+00	local2	suite_2	\N	checkpoint_2	\N	Customer_OrderData.csv	120	0	120	\N	{'evaluated_expectations': 3, 'successful_expectations': 2, 'unsuccessful_expectations': 1, 'success_percent': 66.66666666666666}	f	\N
6	\N	2022-06-16 11:51:52.526885+00	2022-06-16 11:52:09.317327+00	local2	suite_2	\N	checkpoint_2	\N	Customer_OrderData.csv	120	0	120	\N	{'evaluated_expectations': 3, 'successful_expectations': 2, 'unsuccessful_expectations': 1, 'success_percent': 66.66666666666666}	f	\N
9	\N	2022-06-16 11:54:15.931523+00	2022-06-16 11:54:34.663966+00	local2	suite_2	\N	checkpoint_2	\N	Customer_OrderData.csv	120	0	120	\N	{'evaluated_expectations': 3, 'successful_expectations': 2, 'unsuccessful_expectations': 1, 'success_percent': 66.66666666666666}	f	\N
12	\N	2022-06-16 12:01:10.623338+00	2022-06-16 12:01:32.386998+00	local	suite_3	\N	checkpoint3	\N	Customer_OrderData.csv	120	-60	180	\N	{'evaluated_expectations': 6, 'successful_expectations': 2, 'unsuccessful_expectations': 4, 'success_percent': 33.33333333333333}	f	\N
13	\N	2022-06-16 12:03:40.763379+00	2022-06-16 12:04:03.229286+00	local	suite_3	\N	checkpoint3	\N	Customer_OrderData.csv	120	-60	180	\N	{'evaluated_expectations': 6, 'successful_expectations': 2, 'unsuccessful_expectations': 4, 'success_percent': 33.33333333333333}	f	\N
14	\N	2022-06-16 12:05:54.340423+00	2022-06-16 12:06:17.480981+00	local	suite_3	\N	checkpoint3	\N	Customer_OrderData.csv	120	-60	180	\N	{'evaluated_expectations': 6, 'successful_expectations': 2, 'unsuccessful_expectations': 4, 'success_percent': 33.33333333333333}	f	\N
15	\N	2022-07-04 07:20:27.23261+00	2022-07-04 07:21:02.623321+00	local	suite_2	\N	checkpoint_1	\N	Customer_OrderData.csv	120	0	120	\N	{'evaluated_expectations': 3, 'successful_expectations': 2, 'unsuccessful_expectations': 1, 'success_percent': 66.66666666666666}	f	\N
\.


--
-- Data for Name: ge_api_result; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.ge_api_result (id, total_records, records_passed, records_failed, p_records_passed, p_records_failed, result_status, json_result, created_at, updated_at, rule_id_id, execution_id_id) FROM stdin;
\.


--
-- Data for Name: ge_api_resultv1; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.ge_api_resultv1 (id, datasource_name, dataset_name, expectation_suite_name, run_name, expectation_name, dq_dimension, result_status, result_json, created_at, updated_at, expectation_config, cde_name) FROM stdin;
7	local	Customer_OrderData.csv	suite_2	checkpoint_1-20220614-110800	expect_column_values_to_be_of_type	accuracy	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-14 11:08:14.123575+00	2022-06-14 11:08:14.123575+00	{"meta": {}, "kwargs": {"column": "Name", "cost": 0, "mostly": 0.8, "type_": "str", "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_of_type"}	Name
8	local	Customer_OrderData.csv	suite_2	checkpoint_1-20220614-110800	expect_column_values_to_be_unique	uniqueness	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-14 11:08:14.123575+00	2022-06-14 11:08:14.123575+00	{"meta": {}, "kwargs": {"column": "Email Address", "cost": "10", "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_unique"}	Email Address
9	local	Customer_OrderData.csv	suite_2	checkpoint_1-20220614-110800	expect_column_values_to_be_between	validity	f	{"element_count": 120, "unexpected_count": 120, "unexpected_percent": 100.0, "partial_unexpected_list": [6.92, 35.84, 364.69, 35.84, 31.79, 6.92, 31.79, 31.79, 524.96, 263.33, 6.92, 263.33, 97.44, 35.84, 56.67, 56.67, 524.96, 263.33, 263.33, 56.67], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 100.0, "unexpected_percent_nonmissing": 100.0, "partial_unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], "partial_unexpected_counts": [{"value": 263.33, "count": 17}, {"value": 6.92, "count": 14}, {"value": 31.79, "count": 12}, {"value": 502.54, "count": 12}, {"value": 35.84, "count": 11}, {"value": 117.11, "count": 10}, {"value": 56.67, "count": 9}, {"value": 159.42, "count": 9}, {"value": 364.69, "count": 9}, {"value": 524.96, "count": 9}, {"value": 97.44, "count": 5}, {"value": 90.93, "count": 3}], "unexpected_list": [6.92, 35.84, 364.69, 35.84, 31.79, 6.92, 31.79, 31.79, 524.96, 263.33, 6.92, 263.33, 97.44, 35.84, 56.67, 56.67, 524.96, 263.33, 263.33, 56.67, 524.96, 502.54, 90.93, 263.33, 159.42, 524.96, 263.33, 502.54, 524.96, 502.54, 31.79, 6.92, 97.44, 502.54, 97.44, 263.33, 56.67, 502.54, 263.33, 502.54, 35.84, 35.84, 117.11, 31.79, 502.54, 263.33, 35.84, 263.33, 364.69, 6.92, 364.69, 502.54, 524.96, 263.33, 364.69, 364.69, 35.84, 117.11, 31.79, 117.11, 56.67, 6.92, 117.11, 524.96, 6.92, 31.79, 117.11, 31.79, 159.42, 90.93, 6.92, 502.54, 31.79, 56.67, 35.84, 159.42, 6.92, 31.79, 35.84, 117.11, 6.92, 502.54, 56.67, 159.42, 6.92, 159.42, 524.96, 6.92, 6.92, 117.11, 364.69, 35.84, 56.67, 263.33, 31.79, 159.42, 364.69, 364.69, 117.11, 159.42, 263.33, 6.92, 117.11, 159.42, 97.44, 502.54, 263.33, 90.93, 502.54, 159.42, 56.67, 263.33, 31.79, 524.96, 364.69, 35.84, 97.44, 117.11, 263.33, 263.33], "unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119]}	2022-06-14 11:08:14.123575+00	2022-06-14 11:08:14.123575+00	{"meta": {}, "kwargs": {"column": "Unit Cost", "cost": "10", "max_value": 1000000, "min_value": 10000, "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_between"}	Unit Cost
10	local	Customer_OrderData.csv	suite_2	checkpoint_1-20220616-114856	expect_column_values_to_be_of_type	accuracy	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-16 11:49:09.758232+00	2022-06-16 11:49:09.758232+00	{"kwargs": {"column": "Name", "cost": 0, "mostly": 0.8, "type_": "str", "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_of_type", "meta": {}}	Name
11	local	Customer_OrderData.csv	suite_2	checkpoint_1-20220616-114856	expect_column_values_to_be_unique	uniqueness	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-16 11:49:09.758232+00	2022-06-16 11:49:09.758232+00	{"kwargs": {"column": "Email Address", "cost": "10", "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_unique", "meta": {}}	Email Address
12	local	Customer_OrderData.csv	suite_2	checkpoint_1-20220616-114856	expect_column_values_to_be_between	validity	f	{"element_count": 120, "unexpected_count": 120, "unexpected_percent": 100.0, "partial_unexpected_list": [6.92, 35.84, 364.69, 35.84, 31.79, 6.92, 31.79, 31.79, 524.96, 263.33, 6.92, 263.33, 97.44, 35.84, 56.67, 56.67, 524.96, 263.33, 263.33, 56.67], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 100.0, "unexpected_percent_nonmissing": 100.0, "partial_unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], "partial_unexpected_counts": [{"value": 263.33, "count": 17}, {"value": 6.92, "count": 14}, {"value": 31.79, "count": 12}, {"value": 502.54, "count": 12}, {"value": 35.84, "count": 11}, {"value": 117.11, "count": 10}, {"value": 56.67, "count": 9}, {"value": 159.42, "count": 9}, {"value": 364.69, "count": 9}, {"value": 524.96, "count": 9}, {"value": 97.44, "count": 5}, {"value": 90.93, "count": 3}], "unexpected_list": [6.92, 35.84, 364.69, 35.84, 31.79, 6.92, 31.79, 31.79, 524.96, 263.33, 6.92, 263.33, 97.44, 35.84, 56.67, 56.67, 524.96, 263.33, 263.33, 56.67, 524.96, 502.54, 90.93, 263.33, 159.42, 524.96, 263.33, 502.54, 524.96, 502.54, 31.79, 6.92, 97.44, 502.54, 97.44, 263.33, 56.67, 502.54, 263.33, 502.54, 35.84, 35.84, 117.11, 31.79, 502.54, 263.33, 35.84, 263.33, 364.69, 6.92, 364.69, 502.54, 524.96, 263.33, 364.69, 364.69, 35.84, 117.11, 31.79, 117.11, 56.67, 6.92, 117.11, 524.96, 6.92, 31.79, 117.11, 31.79, 159.42, 90.93, 6.92, 502.54, 31.79, 56.67, 35.84, 159.42, 6.92, 31.79, 35.84, 117.11, 6.92, 502.54, 56.67, 159.42, 6.92, 159.42, 524.96, 6.92, 6.92, 117.11, 364.69, 35.84, 56.67, 263.33, 31.79, 159.42, 364.69, 364.69, 117.11, 159.42, 263.33, 6.92, 117.11, 159.42, 97.44, 502.54, 263.33, 90.93, 502.54, 159.42, 56.67, 263.33, 31.79, 524.96, 364.69, 35.84, 97.44, 117.11, 263.33, 263.33], "unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119]}	2022-06-16 11:49:09.758232+00	2022-06-16 11:49:09.758232+00	{"kwargs": {"column": "Unit Cost", "cost": "10", "max_value": 1000000, "min_value": 10000, "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_between", "meta": {}}	Unit Cost
13	local	Customer_OrderData.csv	suite_2	checkpoint_1-20220616-114920	expect_column_values_to_be_of_type	accuracy	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-16 11:49:32.61914+00	2022-06-16 11:49:32.61914+00	{"kwargs": {"column": "Name", "cost": 0, "mostly": 0.8, "type_": "str", "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_of_type", "meta": {}}	Name
14	local	Customer_OrderData.csv	suite_2	checkpoint_1-20220616-114920	expect_column_values_to_be_unique	uniqueness	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-16 11:49:32.61914+00	2022-06-16 11:49:32.61914+00	{"kwargs": {"column": "Email Address", "cost": "10", "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_unique", "meta": {}}	Email Address
15	local	Customer_OrderData.csv	suite_2	checkpoint_1-20220616-114920	expect_column_values_to_be_between	validity	f	{"element_count": 120, "unexpected_count": 120, "unexpected_percent": 100.0, "partial_unexpected_list": [6.92, 35.84, 364.69, 35.84, 31.79, 6.92, 31.79, 31.79, 524.96, 263.33, 6.92, 263.33, 97.44, 35.84, 56.67, 56.67, 524.96, 263.33, 263.33, 56.67], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 100.0, "unexpected_percent_nonmissing": 100.0, "partial_unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], "partial_unexpected_counts": [{"value": 263.33, "count": 17}, {"value": 6.92, "count": 14}, {"value": 31.79, "count": 12}, {"value": 502.54, "count": 12}, {"value": 35.84, "count": 11}, {"value": 117.11, "count": 10}, {"value": 56.67, "count": 9}, {"value": 159.42, "count": 9}, {"value": 364.69, "count": 9}, {"value": 524.96, "count": 9}, {"value": 97.44, "count": 5}, {"value": 90.93, "count": 3}], "unexpected_list": [6.92, 35.84, 364.69, 35.84, 31.79, 6.92, 31.79, 31.79, 524.96, 263.33, 6.92, 263.33, 97.44, 35.84, 56.67, 56.67, 524.96, 263.33, 263.33, 56.67, 524.96, 502.54, 90.93, 263.33, 159.42, 524.96, 263.33, 502.54, 524.96, 502.54, 31.79, 6.92, 97.44, 502.54, 97.44, 263.33, 56.67, 502.54, 263.33, 502.54, 35.84, 35.84, 117.11, 31.79, 502.54, 263.33, 35.84, 263.33, 364.69, 6.92, 364.69, 502.54, 524.96, 263.33, 364.69, 364.69, 35.84, 117.11, 31.79, 117.11, 56.67, 6.92, 117.11, 524.96, 6.92, 31.79, 117.11, 31.79, 159.42, 90.93, 6.92, 502.54, 31.79, 56.67, 35.84, 159.42, 6.92, 31.79, 35.84, 117.11, 6.92, 502.54, 56.67, 159.42, 6.92, 159.42, 524.96, 6.92, 6.92, 117.11, 364.69, 35.84, 56.67, 263.33, 31.79, 159.42, 364.69, 364.69, 117.11, 159.42, 263.33, 6.92, 117.11, 159.42, 97.44, 502.54, 263.33, 90.93, 502.54, 159.42, 56.67, 263.33, 31.79, 524.96, 364.69, 35.84, 97.44, 117.11, 263.33, 263.33], "unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119]}	2022-06-16 11:49:32.61914+00	2022-06-16 11:49:32.61914+00	{"kwargs": {"column": "Unit Cost", "cost": "10", "max_value": 1000000, "min_value": 10000, "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_between", "meta": {}}	Unit Cost
16	local	Customer_OrderData.csv	suite_2	checkpoint_1-20220616-114944	expect_column_values_to_be_of_type	accuracy	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-16 11:49:57.11197+00	2022-06-16 11:49:57.11197+00	{"kwargs": {"column": "Name", "cost": 0, "mostly": 0.8, "type_": "str", "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_of_type", "meta": {}}	Name
17	local	Customer_OrderData.csv	suite_2	checkpoint_1-20220616-114944	expect_column_values_to_be_unique	uniqueness	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-16 11:49:57.11197+00	2022-06-16 11:49:57.11197+00	{"kwargs": {"column": "Email Address", "cost": "10", "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_unique", "meta": {}}	Email Address
18	local	Customer_OrderData.csv	suite_2	checkpoint_1-20220616-114944	expect_column_values_to_be_between	validity	f	{"element_count": 120, "unexpected_count": 120, "unexpected_percent": 100.0, "partial_unexpected_list": [6.92, 35.84, 364.69, 35.84, 31.79, 6.92, 31.79, 31.79, 524.96, 263.33, 6.92, 263.33, 97.44, 35.84, 56.67, 56.67, 524.96, 263.33, 263.33, 56.67], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 100.0, "unexpected_percent_nonmissing": 100.0, "partial_unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], "partial_unexpected_counts": [{"value": 263.33, "count": 17}, {"value": 6.92, "count": 14}, {"value": 31.79, "count": 12}, {"value": 502.54, "count": 12}, {"value": 35.84, "count": 11}, {"value": 117.11, "count": 10}, {"value": 56.67, "count": 9}, {"value": 159.42, "count": 9}, {"value": 364.69, "count": 9}, {"value": 524.96, "count": 9}, {"value": 97.44, "count": 5}, {"value": 90.93, "count": 3}], "unexpected_list": [6.92, 35.84, 364.69, 35.84, 31.79, 6.92, 31.79, 31.79, 524.96, 263.33, 6.92, 263.33, 97.44, 35.84, 56.67, 56.67, 524.96, 263.33, 263.33, 56.67, 524.96, 502.54, 90.93, 263.33, 159.42, 524.96, 263.33, 502.54, 524.96, 502.54, 31.79, 6.92, 97.44, 502.54, 97.44, 263.33, 56.67, 502.54, 263.33, 502.54, 35.84, 35.84, 117.11, 31.79, 502.54, 263.33, 35.84, 263.33, 364.69, 6.92, 364.69, 502.54, 524.96, 263.33, 364.69, 364.69, 35.84, 117.11, 31.79, 117.11, 56.67, 6.92, 117.11, 524.96, 6.92, 31.79, 117.11, 31.79, 159.42, 90.93, 6.92, 502.54, 31.79, 56.67, 35.84, 159.42, 6.92, 31.79, 35.84, 117.11, 6.92, 502.54, 56.67, 159.42, 6.92, 159.42, 524.96, 6.92, 6.92, 117.11, 364.69, 35.84, 56.67, 263.33, 31.79, 159.42, 364.69, 364.69, 117.11, 159.42, 263.33, 6.92, 117.11, 159.42, 97.44, 502.54, 263.33, 90.93, 502.54, 159.42, 56.67, 263.33, 31.79, 524.96, 364.69, 35.84, 97.44, 117.11, 263.33, 263.33], "unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119]}	2022-06-16 11:49:57.11197+00	2022-06-16 11:49:57.11197+00	{"kwargs": {"column": "Unit Cost", "cost": "10", "max_value": 1000000, "min_value": 10000, "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_between", "meta": {}}	Unit Cost
19	local2	Customer_OrderData.csv	suite_2	checkpoint_2-20220616-115132	expect_column_values_to_be_of_type	accuracy	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-16 11:51:45.884021+00	2022-06-16 11:51:45.884021+00	{"kwargs": {"column": "Name", "cost": 0, "mostly": 0.8, "type_": "str", "batch_id": "4b713199ec1ff5ba9040f5c796cb20d3"}, "expectation_type": "expect_column_values_to_be_of_type", "meta": {}}	Name
20	local2	Customer_OrderData.csv	suite_2	checkpoint_2-20220616-115132	expect_column_values_to_be_unique	uniqueness	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-16 11:51:45.884021+00	2022-06-16 11:51:45.884021+00	{"kwargs": {"column": "Email Address", "cost": "10", "mostly": 0.8, "batch_id": "4b713199ec1ff5ba9040f5c796cb20d3"}, "expectation_type": "expect_column_values_to_be_unique", "meta": {}}	Email Address
21	local2	Customer_OrderData.csv	suite_2	checkpoint_2-20220616-115132	expect_column_values_to_be_between	validity	f	{"element_count": 120, "unexpected_count": 120, "unexpected_percent": 100.0, "partial_unexpected_list": [6.92, 35.84, 364.69, 35.84, 31.79, 6.92, 31.79, 31.79, 524.96, 263.33, 6.92, 263.33, 97.44, 35.84, 56.67, 56.67, 524.96, 263.33, 263.33, 56.67], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 100.0, "unexpected_percent_nonmissing": 100.0, "partial_unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], "partial_unexpected_counts": [{"value": 263.33, "count": 17}, {"value": 6.92, "count": 14}, {"value": 31.79, "count": 12}, {"value": 502.54, "count": 12}, {"value": 35.84, "count": 11}, {"value": 117.11, "count": 10}, {"value": 56.67, "count": 9}, {"value": 159.42, "count": 9}, {"value": 364.69, "count": 9}, {"value": 524.96, "count": 9}, {"value": 97.44, "count": 5}, {"value": 90.93, "count": 3}], "unexpected_list": [6.92, 35.84, 364.69, 35.84, 31.79, 6.92, 31.79, 31.79, 524.96, 263.33, 6.92, 263.33, 97.44, 35.84, 56.67, 56.67, 524.96, 263.33, 263.33, 56.67, 524.96, 502.54, 90.93, 263.33, 159.42, 524.96, 263.33, 502.54, 524.96, 502.54, 31.79, 6.92, 97.44, 502.54, 97.44, 263.33, 56.67, 502.54, 263.33, 502.54, 35.84, 35.84, 117.11, 31.79, 502.54, 263.33, 35.84, 263.33, 364.69, 6.92, 364.69, 502.54, 524.96, 263.33, 364.69, 364.69, 35.84, 117.11, 31.79, 117.11, 56.67, 6.92, 117.11, 524.96, 6.92, 31.79, 117.11, 31.79, 159.42, 90.93, 6.92, 502.54, 31.79, 56.67, 35.84, 159.42, 6.92, 31.79, 35.84, 117.11, 6.92, 502.54, 56.67, 159.42, 6.92, 159.42, 524.96, 6.92, 6.92, 117.11, 364.69, 35.84, 56.67, 263.33, 31.79, 159.42, 364.69, 364.69, 117.11, 159.42, 263.33, 6.92, 117.11, 159.42, 97.44, 502.54, 263.33, 90.93, 502.54, 159.42, 56.67, 263.33, 31.79, 524.96, 364.69, 35.84, 97.44, 117.11, 263.33, 263.33], "unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119]}	2022-06-16 11:51:45.884021+00	2022-06-16 11:51:45.884021+00	{"kwargs": {"column": "Unit Cost", "cost": "10", "max_value": 1000000, "min_value": 10000, "mostly": 0.8, "batch_id": "4b713199ec1ff5ba9040f5c796cb20d3"}, "expectation_type": "expect_column_values_to_be_between", "meta": {}}	Unit Cost
22	local2	Customer_OrderData.csv	suite_2	checkpoint_2-20220616-115154	expect_column_values_to_be_of_type	accuracy	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-16 11:52:08.634062+00	2022-06-16 11:52:08.634062+00	{"kwargs": {"column": "Name", "cost": 0, "mostly": 0.8, "type_": "str", "batch_id": "4b713199ec1ff5ba9040f5c796cb20d3"}, "expectation_type": "expect_column_values_to_be_of_type", "meta": {}}	Name
23	local2	Customer_OrderData.csv	suite_2	checkpoint_2-20220616-115154	expect_column_values_to_be_unique	uniqueness	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-16 11:52:08.634062+00	2022-06-16 11:52:08.634062+00	{"kwargs": {"column": "Email Address", "cost": "10", "mostly": 0.8, "batch_id": "4b713199ec1ff5ba9040f5c796cb20d3"}, "expectation_type": "expect_column_values_to_be_unique", "meta": {}}	Email Address
24	local2	Customer_OrderData.csv	suite_2	checkpoint_2-20220616-115154	expect_column_values_to_be_between	validity	f	{"element_count": 120, "unexpected_count": 120, "unexpected_percent": 100.0, "partial_unexpected_list": [6.92, 35.84, 364.69, 35.84, 31.79, 6.92, 31.79, 31.79, 524.96, 263.33, 6.92, 263.33, 97.44, 35.84, 56.67, 56.67, 524.96, 263.33, 263.33, 56.67], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 100.0, "unexpected_percent_nonmissing": 100.0, "partial_unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], "partial_unexpected_counts": [{"value": 263.33, "count": 17}, {"value": 6.92, "count": 14}, {"value": 31.79, "count": 12}, {"value": 502.54, "count": 12}, {"value": 35.84, "count": 11}, {"value": 117.11, "count": 10}, {"value": 56.67, "count": 9}, {"value": 159.42, "count": 9}, {"value": 364.69, "count": 9}, {"value": 524.96, "count": 9}, {"value": 97.44, "count": 5}, {"value": 90.93, "count": 3}], "unexpected_list": [6.92, 35.84, 364.69, 35.84, 31.79, 6.92, 31.79, 31.79, 524.96, 263.33, 6.92, 263.33, 97.44, 35.84, 56.67, 56.67, 524.96, 263.33, 263.33, 56.67, 524.96, 502.54, 90.93, 263.33, 159.42, 524.96, 263.33, 502.54, 524.96, 502.54, 31.79, 6.92, 97.44, 502.54, 97.44, 263.33, 56.67, 502.54, 263.33, 502.54, 35.84, 35.84, 117.11, 31.79, 502.54, 263.33, 35.84, 263.33, 364.69, 6.92, 364.69, 502.54, 524.96, 263.33, 364.69, 364.69, 35.84, 117.11, 31.79, 117.11, 56.67, 6.92, 117.11, 524.96, 6.92, 31.79, 117.11, 31.79, 159.42, 90.93, 6.92, 502.54, 31.79, 56.67, 35.84, 159.42, 6.92, 31.79, 35.84, 117.11, 6.92, 502.54, 56.67, 159.42, 6.92, 159.42, 524.96, 6.92, 6.92, 117.11, 364.69, 35.84, 56.67, 263.33, 31.79, 159.42, 364.69, 364.69, 117.11, 159.42, 263.33, 6.92, 117.11, 159.42, 97.44, 502.54, 263.33, 90.93, 502.54, 159.42, 56.67, 263.33, 31.79, 524.96, 364.69, 35.84, 97.44, 117.11, 263.33, 263.33], "unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119]}	2022-06-16 11:52:08.634062+00	2022-06-16 11:52:08.634062+00	{"kwargs": {"column": "Unit Cost", "cost": "10", "max_value": 1000000, "min_value": 10000, "mostly": 0.8, "batch_id": "4b713199ec1ff5ba9040f5c796cb20d3"}, "expectation_type": "expect_column_values_to_be_between", "meta": {}}	Unit Cost
25	local	Customer_OrderData.csv	suite_2	checkpoint_1-20220616-115256	expect_column_values_to_be_of_type	accuracy	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-16 11:53:10.862004+00	2022-06-16 11:53:10.862004+00	{"kwargs": {"column": "Name", "cost": 0, "mostly": 0.8, "type_": "str", "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_of_type", "meta": {}}	Name
26	local	Customer_OrderData.csv	suite_2	checkpoint_1-20220616-115256	expect_column_values_to_be_unique	uniqueness	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-16 11:53:10.862004+00	2022-06-16 11:53:10.862004+00	{"kwargs": {"column": "Email Address", "cost": "10", "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_unique", "meta": {}}	Email Address
27	local	Customer_OrderData.csv	suite_2	checkpoint_1-20220616-115256	expect_column_values_to_be_between	validity	f	{"element_count": 120, "unexpected_count": 120, "unexpected_percent": 100.0, "partial_unexpected_list": [6.92, 35.84, 364.69, 35.84, 31.79, 6.92, 31.79, 31.79, 524.96, 263.33, 6.92, 263.33, 97.44, 35.84, 56.67, 56.67, 524.96, 263.33, 263.33, 56.67], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 100.0, "unexpected_percent_nonmissing": 100.0, "partial_unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], "partial_unexpected_counts": [{"value": 263.33, "count": 17}, {"value": 6.92, "count": 14}, {"value": 31.79, "count": 12}, {"value": 502.54, "count": 12}, {"value": 35.84, "count": 11}, {"value": 117.11, "count": 10}, {"value": 56.67, "count": 9}, {"value": 159.42, "count": 9}, {"value": 364.69, "count": 9}, {"value": 524.96, "count": 9}, {"value": 97.44, "count": 5}, {"value": 90.93, "count": 3}], "unexpected_list": [6.92, 35.84, 364.69, 35.84, 31.79, 6.92, 31.79, 31.79, 524.96, 263.33, 6.92, 263.33, 97.44, 35.84, 56.67, 56.67, 524.96, 263.33, 263.33, 56.67, 524.96, 502.54, 90.93, 263.33, 159.42, 524.96, 263.33, 502.54, 524.96, 502.54, 31.79, 6.92, 97.44, 502.54, 97.44, 263.33, 56.67, 502.54, 263.33, 502.54, 35.84, 35.84, 117.11, 31.79, 502.54, 263.33, 35.84, 263.33, 364.69, 6.92, 364.69, 502.54, 524.96, 263.33, 364.69, 364.69, 35.84, 117.11, 31.79, 117.11, 56.67, 6.92, 117.11, 524.96, 6.92, 31.79, 117.11, 31.79, 159.42, 90.93, 6.92, 502.54, 31.79, 56.67, 35.84, 159.42, 6.92, 31.79, 35.84, 117.11, 6.92, 502.54, 56.67, 159.42, 6.92, 159.42, 524.96, 6.92, 6.92, 117.11, 364.69, 35.84, 56.67, 263.33, 31.79, 159.42, 364.69, 364.69, 117.11, 159.42, 263.33, 6.92, 117.11, 159.42, 97.44, 502.54, 263.33, 90.93, 502.54, 159.42, 56.67, 263.33, 31.79, 524.96, 364.69, 35.84, 97.44, 117.11, 263.33, 263.33], "unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119]}	2022-06-16 11:53:10.862004+00	2022-06-16 11:53:10.862004+00	{"kwargs": {"column": "Unit Cost", "cost": "10", "max_value": 1000000, "min_value": 10000, "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_between", "meta": {}}	Unit Cost
28	local	Customer_OrderData.csv	suite_2	checkpoint_1-20220616-115323	expect_column_values_to_be_of_type	accuracy	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-16 11:53:38.535097+00	2022-06-16 11:53:38.535097+00	{"kwargs": {"column": "Name", "cost": 0, "mostly": 0.8, "type_": "str", "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_of_type", "meta": {}}	Name
29	local	Customer_OrderData.csv	suite_2	checkpoint_1-20220616-115323	expect_column_values_to_be_unique	uniqueness	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-16 11:53:38.535097+00	2022-06-16 11:53:38.535097+00	{"kwargs": {"column": "Email Address", "cost": "10", "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_unique", "meta": {}}	Email Address
30	local	Customer_OrderData.csv	suite_2	checkpoint_1-20220616-115323	expect_column_values_to_be_between	validity	f	{"element_count": 120, "unexpected_count": 120, "unexpected_percent": 100.0, "partial_unexpected_list": [6.92, 35.84, 364.69, 35.84, 31.79, 6.92, 31.79, 31.79, 524.96, 263.33, 6.92, 263.33, 97.44, 35.84, 56.67, 56.67, 524.96, 263.33, 263.33, 56.67], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 100.0, "unexpected_percent_nonmissing": 100.0, "partial_unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], "partial_unexpected_counts": [{"value": 263.33, "count": 17}, {"value": 6.92, "count": 14}, {"value": 31.79, "count": 12}, {"value": 502.54, "count": 12}, {"value": 35.84, "count": 11}, {"value": 117.11, "count": 10}, {"value": 56.67, "count": 9}, {"value": 159.42, "count": 9}, {"value": 364.69, "count": 9}, {"value": 524.96, "count": 9}, {"value": 97.44, "count": 5}, {"value": 90.93, "count": 3}], "unexpected_list": [6.92, 35.84, 364.69, 35.84, 31.79, 6.92, 31.79, 31.79, 524.96, 263.33, 6.92, 263.33, 97.44, 35.84, 56.67, 56.67, 524.96, 263.33, 263.33, 56.67, 524.96, 502.54, 90.93, 263.33, 159.42, 524.96, 263.33, 502.54, 524.96, 502.54, 31.79, 6.92, 97.44, 502.54, 97.44, 263.33, 56.67, 502.54, 263.33, 502.54, 35.84, 35.84, 117.11, 31.79, 502.54, 263.33, 35.84, 263.33, 364.69, 6.92, 364.69, 502.54, 524.96, 263.33, 364.69, 364.69, 35.84, 117.11, 31.79, 117.11, 56.67, 6.92, 117.11, 524.96, 6.92, 31.79, 117.11, 31.79, 159.42, 90.93, 6.92, 502.54, 31.79, 56.67, 35.84, 159.42, 6.92, 31.79, 35.84, 117.11, 6.92, 502.54, 56.67, 159.42, 6.92, 159.42, 524.96, 6.92, 6.92, 117.11, 364.69, 35.84, 56.67, 263.33, 31.79, 159.42, 364.69, 364.69, 117.11, 159.42, 263.33, 6.92, 117.11, 159.42, 97.44, 502.54, 263.33, 90.93, 502.54, 159.42, 56.67, 263.33, 31.79, 524.96, 364.69, 35.84, 97.44, 117.11, 263.33, 263.33], "unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119]}	2022-06-16 11:53:38.535097+00	2022-06-16 11:53:38.535097+00	{"kwargs": {"column": "Unit Cost", "cost": "10", "max_value": 1000000, "min_value": 10000, "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_between", "meta": {}}	Unit Cost
31	local2	Customer_OrderData.csv	suite_2	checkpoint_2-20220616-115418	expect_column_values_to_be_of_type	accuracy	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-16 11:54:34.00346+00	2022-06-16 11:54:34.00346+00	{"kwargs": {"column": "Name", "cost": 0, "mostly": 0.8, "type_": "str", "batch_id": "4b713199ec1ff5ba9040f5c796cb20d3"}, "expectation_type": "expect_column_values_to_be_of_type", "meta": {}}	Name
32	local2	Customer_OrderData.csv	suite_2	checkpoint_2-20220616-115418	expect_column_values_to_be_unique	uniqueness	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-16 11:54:34.00346+00	2022-06-16 11:54:34.00346+00	{"kwargs": {"column": "Email Address", "cost": "10", "mostly": 0.8, "batch_id": "4b713199ec1ff5ba9040f5c796cb20d3"}, "expectation_type": "expect_column_values_to_be_unique", "meta": {}}	Email Address
33	local2	Customer_OrderData.csv	suite_2	checkpoint_2-20220616-115418	expect_column_values_to_be_between	validity	f	{"element_count": 120, "unexpected_count": 120, "unexpected_percent": 100.0, "partial_unexpected_list": [6.92, 35.84, 364.69, 35.84, 31.79, 6.92, 31.79, 31.79, 524.96, 263.33, 6.92, 263.33, 97.44, 35.84, 56.67, 56.67, 524.96, 263.33, 263.33, 56.67], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 100.0, "unexpected_percent_nonmissing": 100.0, "partial_unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], "partial_unexpected_counts": [{"value": 263.33, "count": 17}, {"value": 6.92, "count": 14}, {"value": 31.79, "count": 12}, {"value": 502.54, "count": 12}, {"value": 35.84, "count": 11}, {"value": 117.11, "count": 10}, {"value": 56.67, "count": 9}, {"value": 159.42, "count": 9}, {"value": 364.69, "count": 9}, {"value": 524.96, "count": 9}, {"value": 97.44, "count": 5}, {"value": 90.93, "count": 3}], "unexpected_list": [6.92, 35.84, 364.69, 35.84, 31.79, 6.92, 31.79, 31.79, 524.96, 263.33, 6.92, 263.33, 97.44, 35.84, 56.67, 56.67, 524.96, 263.33, 263.33, 56.67, 524.96, 502.54, 90.93, 263.33, 159.42, 524.96, 263.33, 502.54, 524.96, 502.54, 31.79, 6.92, 97.44, 502.54, 97.44, 263.33, 56.67, 502.54, 263.33, 502.54, 35.84, 35.84, 117.11, 31.79, 502.54, 263.33, 35.84, 263.33, 364.69, 6.92, 364.69, 502.54, 524.96, 263.33, 364.69, 364.69, 35.84, 117.11, 31.79, 117.11, 56.67, 6.92, 117.11, 524.96, 6.92, 31.79, 117.11, 31.79, 159.42, 90.93, 6.92, 502.54, 31.79, 56.67, 35.84, 159.42, 6.92, 31.79, 35.84, 117.11, 6.92, 502.54, 56.67, 159.42, 6.92, 159.42, 524.96, 6.92, 6.92, 117.11, 364.69, 35.84, 56.67, 263.33, 31.79, 159.42, 364.69, 364.69, 117.11, 159.42, 263.33, 6.92, 117.11, 159.42, 97.44, 502.54, 263.33, 90.93, 502.54, 159.42, 56.67, 263.33, 31.79, 524.96, 364.69, 35.84, 97.44, 117.11, 263.33, 263.33], "unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119]}	2022-06-16 11:54:34.00346+00	2022-06-16 11:54:34.00346+00	{"kwargs": {"column": "Unit Cost", "cost": "10", "max_value": 1000000, "min_value": 10000, "mostly": 0.8, "batch_id": "4b713199ec1ff5ba9040f5c796cb20d3"}, "expectation_type": "expect_column_values_to_be_between", "meta": {}}	Unit Cost
34	local	Customer_OrderData.csv	suite_3	SAMPLE_RUN-20220616-115813	expect_column_values_to_be_of_type	accuracy	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-16 11:58:33.644731+00	2022-06-16 11:58:33.644731+00	{"kwargs": {"column": "Name", "cost": "10", "mostly": 0.8, "type_": "str", "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_of_type", "meta": {}}	Name
35	local	Customer_OrderData.csv	suite_3	SAMPLE_RUN-20220616-115813	expect_column_values_to_not_be_null	completeness	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-16 11:58:33.644731+00	2022-06-16 11:58:33.644731+00	{"kwargs": {"column": "Total Revenue", "cost": 0, "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_not_be_null", "meta": {}}	Total Revenue
36	local	Customer_OrderData.csv	suite_3	SAMPLE_RUN-20220616-115813	expect_column_values_to_be_increasing	precision	f	{"element_count": 120, "unexpected_count": 60, "unexpected_percent": 50.0, "partial_unexpected_list": [880811536, 174590194, 425793445, 601245963, 732588374, 176461303, 314505374, 807785928, 324669444, 246248090, 116205585, 198927056, 459386289, 425418365, 571997869, 440306556, 710296428, 222504317, 358570849, 274930989], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 50.0, "unexpected_percent_nonmissing": 50.0, "partial_unexpected_index_list": [3, 4, 6, 8, 10, 12, 14, 17, 18, 19, 22, 25, 27, 28, 31, 32, 34, 36, 38, 39], "partial_unexpected_counts": [{"value": 116205585, "count": 1}, {"value": 174590194, "count": 1}, {"value": 176461303, "count": 1}, {"value": 198927056, "count": 1}, {"value": 222504317, "count": 1}, {"value": 246248090, "count": 1}, {"value": 274930989, "count": 1}, {"value": 314505374, "count": 1}, {"value": 324669444, "count": 1}, {"value": 358570849, "count": 1}, {"value": 425418365, "count": 1}, {"value": 425793445, "count": 1}, {"value": 440306556, "count": 1}, {"value": 459386289, "count": 1}, {"value": 571997869, "count": 1}, {"value": 601245963, "count": 1}, {"value": 710296428, "count": 1}, {"value": 732588374, "count": 1}, {"value": 807785928, "count": 1}, {"value": 880811536, "count": 1}], "unexpected_list": [880811536, 174590194, 425793445, 601245963, 732588374, 176461303, 314505374, 807785928, 324669444, 246248090, 116205585, 198927056, 459386289, 425418365, 571997869, 440306556, 710296428, 222504317, 358570849, 274930989, 548299157, 153842341, 101328551, 349235904, 156530129, 286891067, 252889239, 179137074, 887124383, 467399013, 104191863, 294530856, 265081918, 529276502, 642134416, 315402734, 839094388, 434008300, 156295812, 363086831, 496523940, 343752610, 180908620, 500371730, 494570004, 190777862, 146634709, 450544869, 290227735, 484823930, 278474080, 940318810, 219787776, 274500548, 270154511, 529330146, 527456033, 213969314, 165348374, 140492665], "unexpected_index_list": [3, 4, 6, 8, 10, 12, 14, 17, 18, 19, 22, 25, 27, 28, 31, 32, 34, 36, 38, 39, 41, 42, 44, 46, 49, 52, 54, 55, 57, 58, 60, 62, 65, 67, 69, 73, 75, 76, 79, 81, 84, 85, 87, 90, 91, 92, 95, 97, 99, 101, 103, 105, 106, 108, 109, 112, 113, 116, 117, 119]}	2022-06-16 11:58:33.644731+00	2022-06-16 11:58:33.644731+00	{"kwargs": {"column": "Order ID", "cost": 0, "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_increasing", "meta": {}}	Order ID
37	local	Customer_OrderData.csv	suite_3	SAMPLE_RUN-20220616-115813	expect_column_values_to_be_between	validity	f	{"element_count": 120, "unexpected_count": 120, "unexpected_percent": 100.0, "partial_unexpected_list": [6.92, 35.84, 364.69, 35.84, 31.79, 6.92, 31.79, 31.79, 524.96, 263.33, 6.92, 263.33, 97.44, 35.84, 56.67, 56.67, 524.96, 263.33, 263.33, 56.67], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 100.0, "unexpected_percent_nonmissing": 100.0, "partial_unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], "partial_unexpected_counts": [{"value": 263.33, "count": 17}, {"value": 6.92, "count": 14}, {"value": 31.79, "count": 12}, {"value": 502.54, "count": 12}, {"value": 35.84, "count": 11}, {"value": 117.11, "count": 10}, {"value": 56.67, "count": 9}, {"value": 159.42, "count": 9}, {"value": 364.69, "count": 9}, {"value": 524.96, "count": 9}, {"value": 97.44, "count": 5}, {"value": 90.93, "count": 3}], "unexpected_list": [6.92, 35.84, 364.69, 35.84, 31.79, 6.92, 31.79, 31.79, 524.96, 263.33, 6.92, 263.33, 97.44, 35.84, 56.67, 56.67, 524.96, 263.33, 263.33, 56.67, 524.96, 502.54, 90.93, 263.33, 159.42, 524.96, 263.33, 502.54, 524.96, 502.54, 31.79, 6.92, 97.44, 502.54, 97.44, 263.33, 56.67, 502.54, 263.33, 502.54, 35.84, 35.84, 117.11, 31.79, 502.54, 263.33, 35.84, 263.33, 364.69, 6.92, 364.69, 502.54, 524.96, 263.33, 364.69, 364.69, 35.84, 117.11, 31.79, 117.11, 56.67, 6.92, 117.11, 524.96, 6.92, 31.79, 117.11, 31.79, 159.42, 90.93, 6.92, 502.54, 31.79, 56.67, 35.84, 159.42, 6.92, 31.79, 35.84, 117.11, 6.92, 502.54, 56.67, 159.42, 6.92, 159.42, 524.96, 6.92, 6.92, 117.11, 364.69, 35.84, 56.67, 263.33, 31.79, 159.42, 364.69, 364.69, 117.11, 159.42, 263.33, 6.92, 117.11, 159.42, 97.44, 502.54, 263.33, 90.93, 502.54, 159.42, 56.67, 263.33, 31.79, 524.96, 364.69, 35.84, 97.44, 117.11, 263.33, 263.33], "unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119]}	2022-06-16 11:58:33.644731+00	2022-06-16 11:58:33.644731+00	{"kwargs": {"column": "Unit Cost", "cost": 0, "max_value": 1000000, "min_value": 1000, "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_between", "meta": {}}	Unit Cost
38	local	Customer_OrderData.csv	suite_3	SAMPLE_RUN-20220616-115813	expect_column_min_to_be_between	consistency	f	{"observed_value": 6.92}	2022-06-16 11:58:33.644731+00	2022-06-16 11:58:33.644731+00	{"kwargs": {"column": "Unit Cost", "cost": 0, "max_value": 2000, "min_value": 1000, "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_min_to_be_between", "meta": {}}	Unit Cost
39	local	Customer_OrderData.csv	suite_3	SAMPLE_RUN-20220616-115813	expect_column_unique_value_count_to_be_between	accessibility	f	{"observed_value": 119}	2022-06-16 11:58:33.644731+00	2022-06-16 11:58:33.644731+00	{"kwargs": {"column": "Extra ", "cost": 0, "max_value": 100, "min_value": 0, "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_unique_value_count_to_be_between", "meta": {}}	Extra 
57	local	Customer_OrderData.csv	suite_3	checkpoint3-20220616-120343	expect_column_unique_value_count_to_be_between	accessibility	f	{"observed_value": 119}	2022-06-16 12:04:02.570389+00	2022-06-16 12:04:02.570389+00	{"kwargs": {"column": "Extra ", "cost": 0, "max_value": 100, "min_value": 0, "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_unique_value_count_to_be_between", "meta": {}}	Extra 
40	local	Customer_OrderData.csv	suite_2	checkpoint_1-20220616-115952	expect_column_values_to_be_of_type	accuracy	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-16 12:00:09.855972+00	2022-06-16 12:00:09.855972+00	{"kwargs": {"column": "Name", "cost": 0, "mostly": 0.8, "type_": "str", "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_of_type", "meta": {}}	Name
41	local	Customer_OrderData.csv	suite_2	checkpoint_1-20220616-115952	expect_column_values_to_be_unique	uniqueness	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-16 12:00:09.855972+00	2022-06-16 12:00:09.855972+00	{"kwargs": {"column": "Email Address", "cost": "10", "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_unique", "meta": {}}	Email Address
42	local	Customer_OrderData.csv	suite_2	checkpoint_1-20220616-115952	expect_column_values_to_be_between	validity	f	{"element_count": 120, "unexpected_count": 120, "unexpected_percent": 100.0, "partial_unexpected_list": [6.92, 35.84, 364.69, 35.84, 31.79, 6.92, 31.79, 31.79, 524.96, 263.33, 6.92, 263.33, 97.44, 35.84, 56.67, 56.67, 524.96, 263.33, 263.33, 56.67], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 100.0, "unexpected_percent_nonmissing": 100.0, "partial_unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], "partial_unexpected_counts": [{"value": 263.33, "count": 17}, {"value": 6.92, "count": 14}, {"value": 31.79, "count": 12}, {"value": 502.54, "count": 12}, {"value": 35.84, "count": 11}, {"value": 117.11, "count": 10}, {"value": 56.67, "count": 9}, {"value": 159.42, "count": 9}, {"value": 364.69, "count": 9}, {"value": 524.96, "count": 9}, {"value": 97.44, "count": 5}, {"value": 90.93, "count": 3}], "unexpected_list": [6.92, 35.84, 364.69, 35.84, 31.79, 6.92, 31.79, 31.79, 524.96, 263.33, 6.92, 263.33, 97.44, 35.84, 56.67, 56.67, 524.96, 263.33, 263.33, 56.67, 524.96, 502.54, 90.93, 263.33, 159.42, 524.96, 263.33, 502.54, 524.96, 502.54, 31.79, 6.92, 97.44, 502.54, 97.44, 263.33, 56.67, 502.54, 263.33, 502.54, 35.84, 35.84, 117.11, 31.79, 502.54, 263.33, 35.84, 263.33, 364.69, 6.92, 364.69, 502.54, 524.96, 263.33, 364.69, 364.69, 35.84, 117.11, 31.79, 117.11, 56.67, 6.92, 117.11, 524.96, 6.92, 31.79, 117.11, 31.79, 159.42, 90.93, 6.92, 502.54, 31.79, 56.67, 35.84, 159.42, 6.92, 31.79, 35.84, 117.11, 6.92, 502.54, 56.67, 159.42, 6.92, 159.42, 524.96, 6.92, 6.92, 117.11, 364.69, 35.84, 56.67, 263.33, 31.79, 159.42, 364.69, 364.69, 117.11, 159.42, 263.33, 6.92, 117.11, 159.42, 97.44, 502.54, 263.33, 90.93, 502.54, 159.42, 56.67, 263.33, 31.79, 524.96, 364.69, 35.84, 97.44, 117.11, 263.33, 263.33], "unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119]}	2022-06-16 12:00:09.855972+00	2022-06-16 12:00:09.855972+00	{"kwargs": {"column": "Unit Cost", "cost": "10", "max_value": 1000000, "min_value": 10000, "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_between", "meta": {}}	Unit Cost
46	local	Customer_OrderData.csv	suite_3	checkpoint3-20220616-120112	expect_column_values_to_be_of_type	accuracy	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-16 12:01:31.721015+00	2022-06-16 12:01:31.721015+00	{"kwargs": {"column": "Name", "cost": "10", "mostly": 0.8, "type_": "str", "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_of_type", "meta": {}}	Name
47	local	Customer_OrderData.csv	suite_3	checkpoint3-20220616-120112	expect_column_values_to_not_be_null	completeness	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-16 12:01:31.721015+00	2022-06-16 12:01:31.721015+00	{"kwargs": {"column": "Total Revenue", "cost": 0, "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_not_be_null", "meta": {}}	Total Revenue
58	local	Customer_OrderData.csv	suite_3	checkpoint3-20220616-120556	expect_column_values_to_be_of_type	accuracy	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-16 12:06:16.816725+00	2022-06-16 12:06:16.816725+00	{"kwargs": {"column": "Name", "cost": "10", "mostly": 0.8, "type_": "str", "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_of_type", "meta": {}}	Name
59	local	Customer_OrderData.csv	suite_3	checkpoint3-20220616-120556	expect_column_values_to_not_be_null	completeness	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-16 12:06:16.816725+00	2022-06-16 12:06:16.816725+00	{"kwargs": {"column": "Total Revenue", "cost": 0, "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_not_be_null", "meta": {}}	Total Revenue
48	local	Customer_OrderData.csv	suite_3	checkpoint3-20220616-120112	expect_column_values_to_be_increasing	precision	f	{"element_count": 120, "unexpected_count": 60, "unexpected_percent": 50.0, "partial_unexpected_list": [880811536, 174590194, 425793445, 601245963, 732588374, 176461303, 314505374, 807785928, 324669444, 246248090, 116205585, 198927056, 459386289, 425418365, 571997869, 440306556, 710296428, 222504317, 358570849, 274930989], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 50.0, "unexpected_percent_nonmissing": 50.0, "partial_unexpected_index_list": [3, 4, 6, 8, 10, 12, 14, 17, 18, 19, 22, 25, 27, 28, 31, 32, 34, 36, 38, 39], "partial_unexpected_counts": [{"value": 116205585, "count": 1}, {"value": 174590194, "count": 1}, {"value": 176461303, "count": 1}, {"value": 198927056, "count": 1}, {"value": 222504317, "count": 1}, {"value": 246248090, "count": 1}, {"value": 274930989, "count": 1}, {"value": 314505374, "count": 1}, {"value": 324669444, "count": 1}, {"value": 358570849, "count": 1}, {"value": 425418365, "count": 1}, {"value": 425793445, "count": 1}, {"value": 440306556, "count": 1}, {"value": 459386289, "count": 1}, {"value": 571997869, "count": 1}, {"value": 601245963, "count": 1}, {"value": 710296428, "count": 1}, {"value": 732588374, "count": 1}, {"value": 807785928, "count": 1}, {"value": 880811536, "count": 1}], "unexpected_list": [880811536, 174590194, 425793445, 601245963, 732588374, 176461303, 314505374, 807785928, 324669444, 246248090, 116205585, 198927056, 459386289, 425418365, 571997869, 440306556, 710296428, 222504317, 358570849, 274930989, 548299157, 153842341, 101328551, 349235904, 156530129, 286891067, 252889239, 179137074, 887124383, 467399013, 104191863, 294530856, 265081918, 529276502, 642134416, 315402734, 839094388, 434008300, 156295812, 363086831, 496523940, 343752610, 180908620, 500371730, 494570004, 190777862, 146634709, 450544869, 290227735, 484823930, 278474080, 940318810, 219787776, 274500548, 270154511, 529330146, 527456033, 213969314, 165348374, 140492665], "unexpected_index_list": [3, 4, 6, 8, 10, 12, 14, 17, 18, 19, 22, 25, 27, 28, 31, 32, 34, 36, 38, 39, 41, 42, 44, 46, 49, 52, 54, 55, 57, 58, 60, 62, 65, 67, 69, 73, 75, 76, 79, 81, 84, 85, 87, 90, 91, 92, 95, 97, 99, 101, 103, 105, 106, 108, 109, 112, 113, 116, 117, 119]}	2022-06-16 12:01:31.721015+00	2022-06-16 12:01:31.721015+00	{"kwargs": {"column": "Order ID", "cost": 0, "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_increasing", "meta": {}}	Order ID
49	local	Customer_OrderData.csv	suite_3	checkpoint3-20220616-120112	expect_column_values_to_be_between	validity	f	{"element_count": 120, "unexpected_count": 120, "unexpected_percent": 100.0, "partial_unexpected_list": [6.92, 35.84, 364.69, 35.84, 31.79, 6.92, 31.79, 31.79, 524.96, 263.33, 6.92, 263.33, 97.44, 35.84, 56.67, 56.67, 524.96, 263.33, 263.33, 56.67], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 100.0, "unexpected_percent_nonmissing": 100.0, "partial_unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], "partial_unexpected_counts": [{"value": 263.33, "count": 17}, {"value": 6.92, "count": 14}, {"value": 31.79, "count": 12}, {"value": 502.54, "count": 12}, {"value": 35.84, "count": 11}, {"value": 117.11, "count": 10}, {"value": 56.67, "count": 9}, {"value": 159.42, "count": 9}, {"value": 364.69, "count": 9}, {"value": 524.96, "count": 9}, {"value": 97.44, "count": 5}, {"value": 90.93, "count": 3}], "unexpected_list": [6.92, 35.84, 364.69, 35.84, 31.79, 6.92, 31.79, 31.79, 524.96, 263.33, 6.92, 263.33, 97.44, 35.84, 56.67, 56.67, 524.96, 263.33, 263.33, 56.67, 524.96, 502.54, 90.93, 263.33, 159.42, 524.96, 263.33, 502.54, 524.96, 502.54, 31.79, 6.92, 97.44, 502.54, 97.44, 263.33, 56.67, 502.54, 263.33, 502.54, 35.84, 35.84, 117.11, 31.79, 502.54, 263.33, 35.84, 263.33, 364.69, 6.92, 364.69, 502.54, 524.96, 263.33, 364.69, 364.69, 35.84, 117.11, 31.79, 117.11, 56.67, 6.92, 117.11, 524.96, 6.92, 31.79, 117.11, 31.79, 159.42, 90.93, 6.92, 502.54, 31.79, 56.67, 35.84, 159.42, 6.92, 31.79, 35.84, 117.11, 6.92, 502.54, 56.67, 159.42, 6.92, 159.42, 524.96, 6.92, 6.92, 117.11, 364.69, 35.84, 56.67, 263.33, 31.79, 159.42, 364.69, 364.69, 117.11, 159.42, 263.33, 6.92, 117.11, 159.42, 97.44, 502.54, 263.33, 90.93, 502.54, 159.42, 56.67, 263.33, 31.79, 524.96, 364.69, 35.84, 97.44, 117.11, 263.33, 263.33], "unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119]}	2022-06-16 12:01:31.721015+00	2022-06-16 12:01:31.721015+00	{"kwargs": {"column": "Unit Cost", "cost": 0, "max_value": 1000000, "min_value": 1000, "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_between", "meta": {}}	Unit Cost
50	local	Customer_OrderData.csv	suite_3	checkpoint3-20220616-120112	expect_column_min_to_be_between	consistency	f	{"observed_value": 6.92}	2022-06-16 12:01:31.721015+00	2022-06-16 12:01:31.721015+00	{"kwargs": {"column": "Unit Cost", "cost": 0, "max_value": 2000, "min_value": 1000, "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_min_to_be_between", "meta": {}}	Unit Cost
51	local	Customer_OrderData.csv	suite_3	checkpoint3-20220616-120112	expect_column_unique_value_count_to_be_between	accessibility	f	{"observed_value": 119}	2022-06-16 12:01:31.721015+00	2022-06-16 12:01:31.721015+00	{"kwargs": {"column": "Extra ", "cost": 0, "max_value": 100, "min_value": 0, "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_unique_value_count_to_be_between", "meta": {}}	Extra 
52	local	Customer_OrderData.csv	suite_3	checkpoint3-20220616-120343	expect_column_values_to_be_of_type	accuracy	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-16 12:04:02.570389+00	2022-06-16 12:04:02.570389+00	{"kwargs": {"column": "Name", "cost": "10", "mostly": 0.8, "type_": "str", "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_of_type", "meta": {}}	Name
53	local	Customer_OrderData.csv	suite_3	checkpoint3-20220616-120343	expect_column_values_to_not_be_null	completeness	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-16 12:04:02.570389+00	2022-06-16 12:04:02.570389+00	{"kwargs": {"column": "Total Revenue", "cost": 0, "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_not_be_null", "meta": {}}	Total Revenue
54	local	Customer_OrderData.csv	suite_3	checkpoint3-20220616-120343	expect_column_values_to_be_increasing	precision	f	{"element_count": 120, "unexpected_count": 60, "unexpected_percent": 50.0, "partial_unexpected_list": [880811536, 174590194, 425793445, 601245963, 732588374, 176461303, 314505374, 807785928, 324669444, 246248090, 116205585, 198927056, 459386289, 425418365, 571997869, 440306556, 710296428, 222504317, 358570849, 274930989], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 50.0, "unexpected_percent_nonmissing": 50.0, "partial_unexpected_index_list": [3, 4, 6, 8, 10, 12, 14, 17, 18, 19, 22, 25, 27, 28, 31, 32, 34, 36, 38, 39], "partial_unexpected_counts": [{"value": 116205585, "count": 1}, {"value": 174590194, "count": 1}, {"value": 176461303, "count": 1}, {"value": 198927056, "count": 1}, {"value": 222504317, "count": 1}, {"value": 246248090, "count": 1}, {"value": 274930989, "count": 1}, {"value": 314505374, "count": 1}, {"value": 324669444, "count": 1}, {"value": 358570849, "count": 1}, {"value": 425418365, "count": 1}, {"value": 425793445, "count": 1}, {"value": 440306556, "count": 1}, {"value": 459386289, "count": 1}, {"value": 571997869, "count": 1}, {"value": 601245963, "count": 1}, {"value": 710296428, "count": 1}, {"value": 732588374, "count": 1}, {"value": 807785928, "count": 1}, {"value": 880811536, "count": 1}], "unexpected_list": [880811536, 174590194, 425793445, 601245963, 732588374, 176461303, 314505374, 807785928, 324669444, 246248090, 116205585, 198927056, 459386289, 425418365, 571997869, 440306556, 710296428, 222504317, 358570849, 274930989, 548299157, 153842341, 101328551, 349235904, 156530129, 286891067, 252889239, 179137074, 887124383, 467399013, 104191863, 294530856, 265081918, 529276502, 642134416, 315402734, 839094388, 434008300, 156295812, 363086831, 496523940, 343752610, 180908620, 500371730, 494570004, 190777862, 146634709, 450544869, 290227735, 484823930, 278474080, 940318810, 219787776, 274500548, 270154511, 529330146, 527456033, 213969314, 165348374, 140492665], "unexpected_index_list": [3, 4, 6, 8, 10, 12, 14, 17, 18, 19, 22, 25, 27, 28, 31, 32, 34, 36, 38, 39, 41, 42, 44, 46, 49, 52, 54, 55, 57, 58, 60, 62, 65, 67, 69, 73, 75, 76, 79, 81, 84, 85, 87, 90, 91, 92, 95, 97, 99, 101, 103, 105, 106, 108, 109, 112, 113, 116, 117, 119]}	2022-06-16 12:04:02.570389+00	2022-06-16 12:04:02.570389+00	{"kwargs": {"column": "Order ID", "cost": 0, "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_increasing", "meta": {}}	Order ID
55	local	Customer_OrderData.csv	suite_3	checkpoint3-20220616-120343	expect_column_values_to_be_between	validity	f	{"element_count": 120, "unexpected_count": 120, "unexpected_percent": 100.0, "partial_unexpected_list": [6.92, 35.84, 364.69, 35.84, 31.79, 6.92, 31.79, 31.79, 524.96, 263.33, 6.92, 263.33, 97.44, 35.84, 56.67, 56.67, 524.96, 263.33, 263.33, 56.67], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 100.0, "unexpected_percent_nonmissing": 100.0, "partial_unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], "partial_unexpected_counts": [{"value": 263.33, "count": 17}, {"value": 6.92, "count": 14}, {"value": 31.79, "count": 12}, {"value": 502.54, "count": 12}, {"value": 35.84, "count": 11}, {"value": 117.11, "count": 10}, {"value": 56.67, "count": 9}, {"value": 159.42, "count": 9}, {"value": 364.69, "count": 9}, {"value": 524.96, "count": 9}, {"value": 97.44, "count": 5}, {"value": 90.93, "count": 3}], "unexpected_list": [6.92, 35.84, 364.69, 35.84, 31.79, 6.92, 31.79, 31.79, 524.96, 263.33, 6.92, 263.33, 97.44, 35.84, 56.67, 56.67, 524.96, 263.33, 263.33, 56.67, 524.96, 502.54, 90.93, 263.33, 159.42, 524.96, 263.33, 502.54, 524.96, 502.54, 31.79, 6.92, 97.44, 502.54, 97.44, 263.33, 56.67, 502.54, 263.33, 502.54, 35.84, 35.84, 117.11, 31.79, 502.54, 263.33, 35.84, 263.33, 364.69, 6.92, 364.69, 502.54, 524.96, 263.33, 364.69, 364.69, 35.84, 117.11, 31.79, 117.11, 56.67, 6.92, 117.11, 524.96, 6.92, 31.79, 117.11, 31.79, 159.42, 90.93, 6.92, 502.54, 31.79, 56.67, 35.84, 159.42, 6.92, 31.79, 35.84, 117.11, 6.92, 502.54, 56.67, 159.42, 6.92, 159.42, 524.96, 6.92, 6.92, 117.11, 364.69, 35.84, 56.67, 263.33, 31.79, 159.42, 364.69, 364.69, 117.11, 159.42, 263.33, 6.92, 117.11, 159.42, 97.44, 502.54, 263.33, 90.93, 502.54, 159.42, 56.67, 263.33, 31.79, 524.96, 364.69, 35.84, 97.44, 117.11, 263.33, 263.33], "unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119]}	2022-06-16 12:04:02.570389+00	2022-06-16 12:04:02.570389+00	{"kwargs": {"column": "Unit Cost", "cost": 0, "max_value": 1000000, "min_value": 1000, "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_between", "meta": {}}	Unit Cost
56	local	Customer_OrderData.csv	suite_3	checkpoint3-20220616-120343	expect_column_min_to_be_between	consistency	f	{"observed_value": 6.92}	2022-06-16 12:04:02.570389+00	2022-06-16 12:04:02.570389+00	{"kwargs": {"column": "Unit Cost", "cost": 0, "max_value": 2000, "min_value": 1000, "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_min_to_be_between", "meta": {}}	Unit Cost
60	local	Customer_OrderData.csv	suite_3	checkpoint3-20220616-120556	expect_column_values_to_be_increasing	precision	f	{"element_count": 120, "unexpected_count": 60, "unexpected_percent": 50.0, "partial_unexpected_list": [880811536, 174590194, 425793445, 601245963, 732588374, 176461303, 314505374, 807785928, 324669444, 246248090, 116205585, 198927056, 459386289, 425418365, 571997869, 440306556, 710296428, 222504317, 358570849, 274930989], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 50.0, "unexpected_percent_nonmissing": 50.0, "partial_unexpected_index_list": [3, 4, 6, 8, 10, 12, 14, 17, 18, 19, 22, 25, 27, 28, 31, 32, 34, 36, 38, 39], "partial_unexpected_counts": [{"value": 116205585, "count": 1}, {"value": 174590194, "count": 1}, {"value": 176461303, "count": 1}, {"value": 198927056, "count": 1}, {"value": 222504317, "count": 1}, {"value": 246248090, "count": 1}, {"value": 274930989, "count": 1}, {"value": 314505374, "count": 1}, {"value": 324669444, "count": 1}, {"value": 358570849, "count": 1}, {"value": 425418365, "count": 1}, {"value": 425793445, "count": 1}, {"value": 440306556, "count": 1}, {"value": 459386289, "count": 1}, {"value": 571997869, "count": 1}, {"value": 601245963, "count": 1}, {"value": 710296428, "count": 1}, {"value": 732588374, "count": 1}, {"value": 807785928, "count": 1}, {"value": 880811536, "count": 1}], "unexpected_list": [880811536, 174590194, 425793445, 601245963, 732588374, 176461303, 314505374, 807785928, 324669444, 246248090, 116205585, 198927056, 459386289, 425418365, 571997869, 440306556, 710296428, 222504317, 358570849, 274930989, 548299157, 153842341, 101328551, 349235904, 156530129, 286891067, 252889239, 179137074, 887124383, 467399013, 104191863, 294530856, 265081918, 529276502, 642134416, 315402734, 839094388, 434008300, 156295812, 363086831, 496523940, 343752610, 180908620, 500371730, 494570004, 190777862, 146634709, 450544869, 290227735, 484823930, 278474080, 940318810, 219787776, 274500548, 270154511, 529330146, 527456033, 213969314, 165348374, 140492665], "unexpected_index_list": [3, 4, 6, 8, 10, 12, 14, 17, 18, 19, 22, 25, 27, 28, 31, 32, 34, 36, 38, 39, 41, 42, 44, 46, 49, 52, 54, 55, 57, 58, 60, 62, 65, 67, 69, 73, 75, 76, 79, 81, 84, 85, 87, 90, 91, 92, 95, 97, 99, 101, 103, 105, 106, 108, 109, 112, 113, 116, 117, 119]}	2022-06-16 12:06:16.816725+00	2022-06-16 12:06:16.816725+00	{"kwargs": {"column": "Order ID", "cost": 0, "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_increasing", "meta": {}}	Order ID
61	local	Customer_OrderData.csv	suite_3	checkpoint3-20220616-120556	expect_column_values_to_be_between	validity	f	{"element_count": 120, "unexpected_count": 120, "unexpected_percent": 100.0, "partial_unexpected_list": [6.92, 35.84, 364.69, 35.84, 31.79, 6.92, 31.79, 31.79, 524.96, 263.33, 6.92, 263.33, 97.44, 35.84, 56.67, 56.67, 524.96, 263.33, 263.33, 56.67], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 100.0, "unexpected_percent_nonmissing": 100.0, "partial_unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], "partial_unexpected_counts": [{"value": 263.33, "count": 17}, {"value": 6.92, "count": 14}, {"value": 31.79, "count": 12}, {"value": 502.54, "count": 12}, {"value": 35.84, "count": 11}, {"value": 117.11, "count": 10}, {"value": 56.67, "count": 9}, {"value": 159.42, "count": 9}, {"value": 364.69, "count": 9}, {"value": 524.96, "count": 9}, {"value": 97.44, "count": 5}, {"value": 90.93, "count": 3}], "unexpected_list": [6.92, 35.84, 364.69, 35.84, 31.79, 6.92, 31.79, 31.79, 524.96, 263.33, 6.92, 263.33, 97.44, 35.84, 56.67, 56.67, 524.96, 263.33, 263.33, 56.67, 524.96, 502.54, 90.93, 263.33, 159.42, 524.96, 263.33, 502.54, 524.96, 502.54, 31.79, 6.92, 97.44, 502.54, 97.44, 263.33, 56.67, 502.54, 263.33, 502.54, 35.84, 35.84, 117.11, 31.79, 502.54, 263.33, 35.84, 263.33, 364.69, 6.92, 364.69, 502.54, 524.96, 263.33, 364.69, 364.69, 35.84, 117.11, 31.79, 117.11, 56.67, 6.92, 117.11, 524.96, 6.92, 31.79, 117.11, 31.79, 159.42, 90.93, 6.92, 502.54, 31.79, 56.67, 35.84, 159.42, 6.92, 31.79, 35.84, 117.11, 6.92, 502.54, 56.67, 159.42, 6.92, 159.42, 524.96, 6.92, 6.92, 117.11, 364.69, 35.84, 56.67, 263.33, 31.79, 159.42, 364.69, 364.69, 117.11, 159.42, 263.33, 6.92, 117.11, 159.42, 97.44, 502.54, 263.33, 90.93, 502.54, 159.42, 56.67, 263.33, 31.79, 524.96, 364.69, 35.84, 97.44, 117.11, 263.33, 263.33], "unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119]}	2022-06-16 12:06:16.816725+00	2022-06-16 12:06:16.816725+00	{"kwargs": {"column": "Unit Cost", "cost": 0, "max_value": 1000000, "min_value": 1000, "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_between", "meta": {}}	Unit Cost
62	local	Customer_OrderData.csv	suite_3	checkpoint3-20220616-120556	expect_column_min_to_be_between	consistency	f	{"observed_value": 6.92}	2022-06-16 12:06:16.816725+00	2022-06-16 12:06:16.816725+00	{"kwargs": {"column": "Unit Cost", "cost": 0, "max_value": 2000, "min_value": 1000, "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_min_to_be_between", "meta": {}}	Unit Cost
63	local	Customer_OrderData.csv	suite_3	checkpoint3-20220616-120556	expect_column_unique_value_count_to_be_between	accessibility	f	{"observed_value": 119}	2022-06-16 12:06:16.816725+00	2022-06-16 12:06:16.816725+00	{"kwargs": {"column": "Extra ", "cost": 0, "max_value": 100, "min_value": 0, "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_unique_value_count_to_be_between", "meta": {}}	Extra 
64	local2	Customer_OrderData.csv	suite_1	SAMPLE_RUN-20220616-142253	expect_column_values_to_be_of_type	accuracy	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-16 14:23:18.844424+00	2022-06-16 14:23:18.844424+00	{"meta": {}, "kwargs": {"column": "Name", "cost": 0, "mostly": 0.8, "type_": "str", "batch_id": "4b713199ec1ff5ba9040f5c796cb20d3"}, "expectation_type": "expect_column_values_to_be_of_type"}	Name
91	Demo File	Device_Telematry_Data - 1K.csv	Suite_15	Validation_15-20220528-103602	expect_column_values_to_not_be_null	completeness	t	{"element_count": 19, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-05-28 10:36:07.37676+00	2022-05-28 10:36:07.376768+00	{"kwargs": {"column": "ip_address", "cost": "2", "mostly": 0.8, "batch_id": "b3c90269c91d5315de1e62a6b1406a38"}, "meta": {}, "expectation_type": "expect_column_values_to_not_be_null"}	ip_address
68	local	Device_Telemetry_Daily.csv	suite_5	SAMPLE_RUN-20220616-150009	expect_column_values_to_be_increasing	precision	f	{"element_count": 44, "unexpected_count": 23, "unexpected_percent": 52.27272727272727, "partial_unexpected_list": [228.3798712, 99.40581205, 228.3798712, 209.7247013, 97.84500357, 209.7247013, 97.84500357, 237.6601131, 210.2108051, 146.4313907, 210.2108051, 146.4313907, 224.2240308, 180.9516792, 224.2240308, 180.9516792, 176.7867079, 99.88716068, 99.88716068, 113.0064137], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 52.27272727272727, "unexpected_percent_nonmissing": 52.27272727272727, "partial_unexpected_index_list": [2, 3, 5, 6, 7, 10, 11, 14, 15, 17, 19, 21, 24, 25, 28, 29, 30, 31, 34, 36], "partial_unexpected_counts": [{"value": 88.51551867, "count": 2}, {"value": 97.84500357, "count": 2}, {"value": 99.88716068, "count": 2}, {"value": 113.0064137, "count": 2}, {"value": 146.4313907, "count": 2}, {"value": 180.9516792, "count": 2}, {"value": 209.7247013, "count": 2}, {"value": 210.2108051, "count": 2}, {"value": 224.2240308, "count": 2}, {"value": 228.3798712, "count": 2}, {"value": 99.40581205, "count": 1}, {"value": 176.7867079, "count": 1}, {"value": 237.6601131, "count": 1}], "unexpected_list": [228.3798712, 99.40581205, 228.3798712, 209.7247013, 97.84500357, 209.7247013, 97.84500357, 237.6601131, 210.2108051, 146.4313907, 210.2108051, 146.4313907, 224.2240308, 180.9516792, 224.2240308, 180.9516792, 176.7867079, 99.88716068, 99.88716068, 113.0064137, 113.0064137, 88.51551867, 88.51551867], "unexpected_index_list": [2, 3, 5, 6, 7, 10, 11, 14, 15, 17, 19, 21, 24, 25, 28, 29, 30, 31, 34, 36, 38, 41, 43]}	2022-06-16 15:00:33.951399+00	2022-06-16 15:00:33.951399+00	{"meta": {}, "kwargs": {"column": "volt", "cost": 0, "mostly": 0.8, "batch_id": "ef88d3180d3bdb48c4ae3728585294b7"}, "expectation_type": "expect_column_values_to_be_increasing"}	volt
69	local	Device_Telemetry_Daily.csv	suite_5	SAMPLE_RUN-20220616-150009	expect_column_median_to_be_between	consistency	t	{"observed_value": 91.5}	2022-06-16 15:00:33.951399+00	2022-06-16 15:00:33.951399+00	{"meta": {}, "kwargs": {"column": "humidity", "cost": 0, "max_value": 100, "min_value": 0, "mostly": 0.8, "batch_id": "ef88d3180d3bdb48c4ae3728585294b7"}, "expectation_type": "expect_column_median_to_be_between"}	humidity
71	local	Device_Telemetry_Daily.csv	suite_7	SAMPLE_RUN-20220617-103721	expect_column_values_to_be_of_type	accuracy	f	{"observed_value": "int64"}	2022-06-17 10:37:49.688227+00	2022-06-17 10:37:49.688227+00	{"expectation_type": "expect_column_values_to_be_of_type", "meta": {}, "kwargs": {"column": "temperature", "cost": 0, "mostly": 0.8, "type_": "int", "batch_id": "ef88d3180d3bdb48c4ae3728585294b7"}}	temperature
72	local	Device_Telemetry_Daily.csv	suite_7	SAMPLE_RUN-20220617-103721	expect_column_values_to_be_increasing	precision	f	{"element_count": 44, "unexpected_count": 23, "unexpected_percent": 52.27272727272727, "partial_unexpected_list": [0.643491292, 0.501820908, 0.298846244, 0.050265646, 0.681939936, 0.298846244, 0.050265646, 0.681939936, 0.154734672, 0.289774082, 0.336678525, 0.427772637, 0.336678525, 0.201383413, 0.230304766, 0.146957567, 0.10252107, 0.146957567, 0.10252107, 0.189452231], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 52.27272727272727, "unexpected_percent_nonmissing": 52.27272727272727, "partial_unexpected_index_list": [2, 3, 6, 7, 9, 10, 11, 13, 14, 19, 22, 25, 26, 28, 30, 31, 32, 34, 35, 38], "partial_unexpected_counts": [{"value": 0.050265646, "count": 2}, {"value": 0.10252107, "count": 2}, {"value": 0.146957567, "count": 2}, {"value": 0.298846244, "count": 2}, {"value": 0.336678525, "count": 2}, {"value": 0.604392749, "count": 2}, {"value": 0.681939936, "count": 2}, {"value": 0.154734672, "count": 1}, {"value": 0.189452231, "count": 1}, {"value": 0.201383413, "count": 1}, {"value": 0.230304766, "count": 1}, {"value": 0.289774082, "count": 1}, {"value": 0.427772637, "count": 1}, {"value": 0.501820908, "count": 1}, {"value": 0.642761185, "count": 1}, {"value": 0.643491292, "count": 1}], "unexpected_list": [0.643491292, 0.501820908, 0.298846244, 0.050265646, 0.681939936, 0.298846244, 0.050265646, 0.681939936, 0.154734672, 0.289774082, 0.336678525, 0.427772637, 0.336678525, 0.201383413, 0.230304766, 0.146957567, 0.10252107, 0.146957567, 0.10252107, 0.189452231, 0.642761185, 0.604392749, 0.604392749], "unexpected_index_list": [2, 3, 6, 7, 9, 10, 11, 13, 14, 19, 22, 25, 26, 28, 30, 31, 32, 34, 35, 38, 40, 41, 43]}	2022-06-17 10:37:49.688227+00	2022-06-17 10:37:49.688227+00	{"expectation_type": "expect_column_values_to_be_increasing", "meta": {}, "kwargs": {"column": "uv", "cost": 0, "mostly": 0.8, "batch_id": "ef88d3180d3bdb48c4ae3728585294b7"}}	uv
73	local	Device_Telemetry_Daily.csv	suite_7	SAMPLE_RUN-20220617-103721	expect_column_values_to_be_unique	uniqueness	f	{"element_count": 44, "unexpected_count": 44, "unexpected_percent": 100.0, "partial_unexpected_list": [238.3907206, 229.535193, 288.5911251, 238.3907206, 229.535193, 288.5911251, 186.2672662, 343.0179767, 677.1950753, 221.4726566, 186.2672662, 343.0179767, 677.1950753, 221.4726566, 325.6856582, 699.2037267, 434.1628269, 695.4698583, 325.6856582, 699.2037267], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 100.0, "unexpected_percent_nonmissing": 100.0, "partial_unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], "partial_unexpected_counts": [{"value": 186.2672662, "count": 2}, {"value": 221.4726566, "count": 2}, {"value": 229.535193, "count": 2}, {"value": 238.3907206, "count": 2}, {"value": 251.1573028, "count": 2}, {"value": 288.5911251, "count": 2}, {"value": 318.7850744, "count": 2}, {"value": 325.6856582, "count": 2}, {"value": 343.0179767, "count": 2}, {"value": 381.5861024, "count": 2}, {"value": 387.6748063, "count": 2}, {"value": 434.1628269, "count": 2}, {"value": 464.0060286, "count": 2}, {"value": 490.6006413, "count": 2}, {"value": 499.6058845, "count": 2}, {"value": 613.9563092, "count": 2}, {"value": 619.166668, "count": 2}, {"value": 677.1950753, "count": 2}, {"value": 695.4698583, "count": 2}, {"value": 699.2037267, "count": 2}], "unexpected_list": [238.3907206, 229.535193, 288.5911251, 238.3907206, 229.535193, 288.5911251, 186.2672662, 343.0179767, 677.1950753, 221.4726566, 186.2672662, 343.0179767, 677.1950753, 221.4726566, 325.6856582, 699.2037267, 434.1628269, 695.4698583, 325.6856582, 699.2037267, 434.1628269, 695.4698583, 381.5861024, 499.6058845, 464.0060286, 613.9563092, 381.5861024, 499.6058845, 464.0060286, 613.9563092, 318.7850744, 251.1573028, 387.6748063, 318.7850744, 251.1573028, 387.6748063, 490.6006413, 619.166668, 490.6006413, 619.166668, 290.0377934, 617.9048075, 290.0377934, 617.9048075], "unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43]}	2022-06-17 10:37:49.688227+00	2022-06-17 10:37:49.688227+00	{"expectation_type": "expect_column_values_to_be_unique", "meta": {}, "kwargs": {"column": "rotate", "cost": 0, "mostly": 0.8, "batch_id": "ef88d3180d3bdb48c4ae3728585294b7"}}	rotate
74	local	Device_Telemetry_Daily.csv	suite_7	SAMPLE_RUN-20220617-103721	expect_column_values_to_be_between	validity	t	{"element_count": 44, "unexpected_count": 8, "unexpected_percent": 18.181818181818183, "partial_unexpected_list": [99.40581205, 99.40581205, 97.84500357, 97.84500357, 99.88716068, 99.88716068, 88.51551867, 88.51551867], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 18.181818181818183, "unexpected_percent_nonmissing": 18.181818181818183, "partial_unexpected_index_list": [0, 3, 7, 11, 31, 34, 41, 43], "partial_unexpected_counts": [{"value": 88.51551867, "count": 2}, {"value": 97.84500357, "count": 2}, {"value": 99.40581205, "count": 2}, {"value": 99.88716068, "count": 2}], "unexpected_list": [99.40581205, 99.40581205, 97.84500357, 97.84500357, 99.88716068, 99.88716068, 88.51551867, 88.51551867], "unexpected_index_list": [0, 3, 7, 11, 31, 34, 41, 43]}	2022-06-17 10:37:49.688227+00	2022-06-17 10:37:49.688227+00	{"expectation_type": "expect_column_values_to_be_between", "meta": {}, "kwargs": {"column": "volt", "cost": 0, "max_value": 400, "min_value": 100, "mostly": 0.8, "batch_id": "ef88d3180d3bdb48c4ae3728585294b7"}}	volt
123	local	Customer_OrderData.csv	sample_suite	SAMPLE_RUN-20220704-110905	expect_column_values_to_not_be_null	completeness	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-07-04 11:09:43.252261+00	2022-07-04 11:09:43.252261+00	{"meta": {}, "kwargs": {"column": "Unit Cost", "cost": 0, "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_not_be_null"}	Unit Cost
75	local	Device_Telemetry_Daily.csv	suite_8	SAMPLE_RUN-20220627-134413	expect_multicolumn_sum_to_equal	integrity	f	{"element_count": 44, "unexpected_count": 44, "unexpected_percent": 100.0, "partial_unexpected_list": [{"uv": 0.501820908, "temperature": 86}, {"uv": 1.605858145, "temperature": 96}, {"uv": 0.643491292, "temperature": 70}, {"uv": 0.501820908, "temperature": 86}, {"uv": 0.605858145, "temperature": 96}, {"uv": 0.643491292, "temperature": 70}, {"uv": 0.298846244, "temperature": 190}, {"uv": 0.050265646, "temperature": 94}, {"uv": 2.694740291, "temperature": 83}, {"uv": 0.681939936, "temperature": 74}, {"uv": 0.298846244, "temperature": 90}, {"uv": 0.050265646, "temperature": 94}, {"uv": 3.694740291, "temperature": 83}, {"uv": 0.681939936, "temperature": 174}, {"uv": 0.154734672, "temperature": 79}, {"uv": 0.289774082, "temperature": 90}, {"uv": 0.431574496, "temperature": 90}, {"uv": 0.794053352, "temperature": 98}, {"uv": 5.154734672, "temperature": 79}, {"uv": 0.289774082, "temperature": 90}], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 100.0, "unexpected_percent_nonmissing": 100.0, "partial_unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], "partial_unexpected_counts": [{"value": [0.050265646, 94], "count": 2}, {"value": [0.10252107, 73], "count": 2}, {"value": [0.146957567, 79], "count": 2}, {"value": [0.189452231, 89], "count": 2}, {"value": [0.230304766, 99], "count": 2}, {"value": [0.289774082, 90], "count": 2}, {"value": [0.336678525, 71], "count": 2}, {"value": [0.427772637, 99], "count": 2}, {"value": [0.431574496, 90], "count": 2}, {"value": [0.501820908, 86], "count": 2}, {"value": [0.604392749, 86], "count": 2}, {"value": [0.642761185, 99], "count": 2}, {"value": [0.643491292, 70], "count": 2}, {"value": [0.794053352, 98], "count": 2}, {"value": [0.826081275, 80], "count": 2}, {"value": [0.91771425, 86], "count": 2}, {"value": [0.298846244, 190], "count": 1}, {"value": [0.605858145, 96], "count": 1}, {"value": [1.605858145, 96], "count": 1}, {"value": [2.694740291, 83], "count": 1}], "unexpected_list": [{"uv": 0.501820908, "temperature": 86}, {"uv": 1.605858145, "temperature": 96}, {"uv": 0.643491292, "temperature": 70}, {"uv": 0.501820908, "temperature": 86}, {"uv": 0.605858145, "temperature": 96}, {"uv": 0.643491292, "temperature": 70}, {"uv": 0.298846244, "temperature": 190}, {"uv": 0.050265646, "temperature": 94}, {"uv": 2.694740291, "temperature": 83}, {"uv": 0.681939936, "temperature": 74}, {"uv": 0.298846244, "temperature": 90}, {"uv": 0.050265646, "temperature": 94}, {"uv": 3.694740291, "temperature": 83}, {"uv": 0.681939936, "temperature": 174}, {"uv": 0.154734672, "temperature": 79}, {"uv": 0.289774082, "temperature": 90}, {"uv": 0.431574496, "temperature": 90}, {"uv": 0.794053352, "temperature": 98}, {"uv": 5.154734672, "temperature": 79}, {"uv": 0.289774082, "temperature": 90}, {"uv": 0.431574496, "temperature": 90}, {"uv": 0.794053352, "temperature": 98}, {"uv": 0.336678525, "temperature": 71}, {"uv": 0.91771425, "temperature": 86}, {"uv": 4.201383413, "temperature": 192}, {"uv": 0.427772637, "temperature": 99}, {"uv": 0.336678525, "temperature": 71}, {"uv": 0.91771425, "temperature": 86}, {"uv": 0.201383413, "temperature": 92}, {"uv": 0.427772637, "temperature": 99}, {"uv": 0.230304766, "temperature": 99}, {"uv": 0.146957567, "temperature": 79}, {"uv": 0.10252107, "temperature": 73}, {"uv": 0.230304766, "temperature": 99}, {"uv": 0.146957567, "temperature": 79}, {"uv": 0.10252107, "temperature": 73}, {"uv": 0.189452231, "temperature": 89}, {"uv": 0.826081275, "temperature": 80}, {"uv": 0.189452231, "temperature": 89}, {"uv": 0.826081275, "temperature": 80}, {"uv": 0.642761185, "temperature": 99}, {"uv": 0.604392749, "temperature": 86}, {"uv": 0.642761185, "temperature": 99}, {"uv": 0.604392749, "temperature": 86}], "unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43]}	2022-06-27 13:44:42.545312+00	2022-06-27 13:44:42.545312+00	{"meta": {}, "expectation_type": "expect_multicolumn_sum_to_equal", "kwargs": {"column": "uv", "column_list": ["uv", "temperature"], "cost": 0, "mostly": 0.8, "sum_total": "sum_total", "batch_id": "ef88d3180d3bdb48c4ae3728585294b7"}}	uv
76	local	Device_Telemetry_Daily.csv	suite_8	SAMPLE_RUN-20220627-134413	expect_column_values_to_be_increasing	precision	f	{"element_count": 44, "unexpected_count": 23, "unexpected_percent": 52.27272727272727, "partial_unexpected_list": [81, 74, 81, 96, 93, 75, 93, 75, 73, 71, 73, 71, 93, 70, 93, 70, 92, 76, 76, 84], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 52.27272727272727, "unexpected_percent_nonmissing": 52.27272727272727, "partial_unexpected_index_list": [1, 2, 4, 6, 7, 8, 11, 12, 14, 16, 18, 20, 22, 23, 26, 27, 30, 31, 34, 36], "partial_unexpected_counts": [{"value": 93, "count": 4}, {"value": 70, "count": 2}, {"value": 71, "count": 2}, {"value": 73, "count": 2}, {"value": 75, "count": 2}, {"value": 76, "count": 2}, {"value": 81, "count": 2}, {"value": 84, "count": 2}, {"value": 90, "count": 2}, {"value": 74, "count": 1}, {"value": 92, "count": 1}, {"value": 96, "count": 1}], "unexpected_list": [81, 74, 81, 96, 93, 75, 93, 75, 73, 71, 73, 71, 93, 70, 93, 70, 92, 76, 76, 84, 84, 90, 90], "unexpected_index_list": [1, 2, 4, 6, 7, 8, 11, 12, 14, 16, 18, 20, 22, 23, 26, 27, 30, 31, 34, 36, 38, 41, 43]}	2022-06-27 13:44:42.545312+00	2022-06-27 13:44:42.545312+00	{"meta": {}, "expectation_type": "expect_column_values_to_be_increasing", "kwargs": {"column": "humidity", "cost": 0, "mostly": 0.8, "batch_id": "ef88d3180d3bdb48c4ae3728585294b7"}}	humidity
77	local	Device_Telemetry_Daily.csv	wefdsfd	checkpoint105-20220627-134817	expect_column_values_to_be_unique	uniqueness	f	{"element_count": 44, "unexpected_count": 44, "unexpected_percent": 100.0, "partial_unexpected_list": [52.97325615, 172.644545, 100.5658478, 52.97325615, 172.644545, 100.5658478, 176.7142426, 95.85714394, 67.40381551, 126.1580148, 176.7142426, 95.85714394, 67.40381551, 126.1580148, 60.29797315, 115.487247, 199.6499437, 195.2411252, 60.29797315, 115.487247], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 100.0, "unexpected_percent_nonmissing": 100.0, "partial_unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], "partial_unexpected_counts": [{"value": 52.97325615, "count": 2}, {"value": 60.29797315, "count": 2}, {"value": 67.40381551, "count": 2}, {"value": 73.21468712, "count": 2}, {"value": 82.43375498, "count": 2}, {"value": 95.85714394, "count": 2}, {"value": 100.5658478, "count": 2}, {"value": 115.487247, "count": 2}, {"value": 121.6697073, "count": 2}, {"value": 126.0742554, "count": 2}, {"value": 126.1580148, "count": 2}, {"value": 127.6928883, "count": 2}, {"value": 144.2861663, "count": 2}, {"value": 151.7977027, "count": 2}, {"value": 169.0051786, "count": 2}, {"value": 172.644545, "count": 2}, {"value": 176.7142426, "count": 2}, {"value": 195.2411252, "count": 2}, {"value": 196.8500325, "count": 2}, {"value": 199.6499437, "count": 2}], "unexpected_list": [52.97325615, 172.644545, 100.5658478, 52.97325615, 172.644545, 100.5658478, 176.7142426, 95.85714394, 67.40381551, 126.1580148, 176.7142426, 95.85714394, 67.40381551, 126.1580148, 60.29797315, 115.487247, 199.6499437, 195.2411252, 60.29797315, 115.487247, 199.6499437, 195.2411252, 73.21468712, 169.0051786, 126.0742554, 151.7977027, 73.21468712, 169.0051786, 126.0742554, 151.7977027, 144.2861663, 82.43375498, 127.6928883, 144.2861663, 82.43375498, 127.6928883, 121.6697073, 196.8500325, 121.6697073, 196.8500325, 98.18841597, 198.7511658, 98.18841597, 198.7511658], "unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43]}	2022-06-27 13:48:27.011388+00	2022-06-27 13:48:27.01142+00	{"kwargs": {"column": "pressure", "cost": 0, "mostly": 0.8, "batch_id": "ef88d3180d3bdb48c4ae3728585294b7"}, "meta": {}, "expectation_type": "expect_column_values_to_be_unique"}	pressure
78	Demo File	Device_Telematry_Data - 1K.csv	Suite_100	Validation_100-20220628-070821	expect_column_values_to_not_be_null	completeness	t	{"element_count": 19, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-28 07:08:26.775024+00	2022-06-28 07:08:26.77505+00	{"kwargs": {"column": "device_id", "cost": "1000", "mostly": 0.9, "batch_id": "b3c90269c91d5315de1e62a6b1406a38"}, "meta": {}, "expectation_type": "expect_column_values_to_not_be_null"}	device_id
79	Demo File	Device_Telematry_Data - 1K.csv	Suite_100	Validation_100-20220628-070821	expect_column_values_to_be_unique	uniqueness	f	{"element_count": 19, "unexpected_count": 19, "unexpected_percent": 100.0, "partial_unexpected_list": ["01-01-21 6:00", "01-01-21 6:00", "01-01-21 6:00", "01-01-21 6:00", "01-01-21 6:00", "01-01-21 6:00", "01-01-21 6:00", "01-01-21 6:00", "01-01-21 6:00", "01-01-21 6:00", "01-01-21 7:00", "01-01-21 7:00", "01-01-21 7:00", "01-01-21 7:00", "01-01-21 7:00", "01-01-21 7:00", "01-01-21 7:00", "01-01-21 7:00", "01-01-21 7:00"], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 100.0, "unexpected_percent_nonmissing": 100.0, "partial_unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], "partial_unexpected_counts": [{"value": "01-01-21 6:00", "count": 10}, {"value": "01-01-21 7:00", "count": 9}], "unexpected_list": ["01-01-21 6:00", "01-01-21 6:00", "01-01-21 6:00", "01-01-21 6:00", "01-01-21 6:00", "01-01-21 6:00", "01-01-21 6:00", "01-01-21 6:00", "01-01-21 6:00", "01-01-21 6:00", "01-01-21 7:00", "01-01-21 7:00", "01-01-21 7:00", "01-01-21 7:00", "01-01-21 7:00", "01-01-21 7:00", "01-01-21 7:00", "01-01-21 7:00", "01-01-21 7:00"], "unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]}	2022-06-28 07:08:26.775094+00	2022-06-28 07:08:26.775102+00	{"kwargs": {"column": "timestamp", "cost": 0, "mostly": 0.8, "batch_id": "b3c90269c91d5315de1e62a6b1406a38"}, "meta": {}, "expectation_type": "expect_column_values_to_be_unique"}	timestamp
4	local2	Customer_OrderData.csv	suite_2	SAMPLE_RUN-20220514-110320	expect_column_values_to_be_of_type	accuracy	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-05-14 11:03:34.318039+00	2022-05-14 11:03:34.318039+00	{"kwargs": {"column": "Name", "cost": 0, "mostly": 0.8, "type_": "str", "batch_id": "4b713199ec1ff5ba9040f5c796cb20d3"}, "expectation_type": "expect_column_values_to_be_of_type", "meta": {}}	Name
5	local2	Customer_OrderData.csv	suite_2	SAMPLE_RUN-20220514-110320	expect_column_values_to_be_unique	uniqueness	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-05-14 11:03:34.318039+00	2022-05-14 11:03:34.318039+00	{"kwargs": {"column": "Email Address", "cost": "10", "mostly": 0.8, "batch_id": "4b713199ec1ff5ba9040f5c796cb20d3"}, "expectation_type": "expect_column_values_to_be_unique", "meta": {}}	Email Address
6	local2	Customer_OrderData.csv	suite_2	SAMPLE_RUN-20220514-110320	expect_column_values_to_be_between	validity	f	{"element_count": 120, "unexpected_count": 120, "unexpected_percent": 100.0, "partial_unexpected_list": [6.92, 35.84, 364.69, 35.84, 31.79, 6.92, 31.79, 31.79, 524.96, 263.33, 6.92, 263.33, 97.44, 35.84, 56.67, 56.67, 524.96, 263.33, 263.33, 56.67], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 100.0, "unexpected_percent_nonmissing": 100.0, "partial_unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], "partial_unexpected_counts": [{"value": 263.33, "count": 17}, {"value": 6.92, "count": 14}, {"value": 31.79, "count": 12}, {"value": 502.54, "count": 12}, {"value": 35.84, "count": 11}, {"value": 117.11, "count": 10}, {"value": 56.67, "count": 9}, {"value": 159.42, "count": 9}, {"value": 364.69, "count": 9}, {"value": 524.96, "count": 9}, {"value": 97.44, "count": 5}, {"value": 90.93, "count": 3}], "unexpected_list": [6.92, 35.84, 364.69, 35.84, 31.79, 6.92, 31.79, 31.79, 524.96, 263.33, 6.92, 263.33, 97.44, 35.84, 56.67, 56.67, 524.96, 263.33, 263.33, 56.67, 524.96, 502.54, 90.93, 263.33, 159.42, 524.96, 263.33, 502.54, 524.96, 502.54, 31.79, 6.92, 97.44, 502.54, 97.44, 263.33, 56.67, 502.54, 263.33, 502.54, 35.84, 35.84, 117.11, 31.79, 502.54, 263.33, 35.84, 263.33, 364.69, 6.92, 364.69, 502.54, 524.96, 263.33, 364.69, 364.69, 35.84, 117.11, 31.79, 117.11, 56.67, 6.92, 117.11, 524.96, 6.92, 31.79, 117.11, 31.79, 159.42, 90.93, 6.92, 502.54, 31.79, 56.67, 35.84, 159.42, 6.92, 31.79, 35.84, 117.11, 6.92, 502.54, 56.67, 159.42, 6.92, 159.42, 524.96, 6.92, 6.92, 117.11, 364.69, 35.84, 56.67, 263.33, 31.79, 159.42, 364.69, 364.69, 117.11, 159.42, 263.33, 6.92, 117.11, 159.42, 97.44, 502.54, 263.33, 90.93, 502.54, 159.42, 56.67, 263.33, 31.79, 524.96, 364.69, 35.84, 97.44, 117.11, 263.33, 263.33], "unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119]}	2022-05-14 11:03:34.318039+00	2022-05-14 11:03:34.318039+00	{"kwargs": {"column": "Unit Cost", "cost": "10", "max_value": 1000000, "min_value": 10000, "mostly": 0.8, "batch_id": "4b713199ec1ff5ba9040f5c796cb20d3"}, "expectation_type": "expect_column_values_to_be_between", "meta": {}}	Unit Cost
80	Demo File	Device_Telematry_Data - 1K.csv	Suite_12	Validation_12-20220428-094141	expect_column_values_to_be_increasing	precision	f	{}	2022-04-28 09:41:59.352091+00	2022-04-28 09:41:59.352117+00	{"kwargs": {"column": "timestamp", "cost": "200", "mostly": 0.8, "batch_id": "b3c90269c91d5315de1e62a6b1406a38"}, "meta": {}, "expectation_type": "expect_column_values_to_be_increasing"}	timestamp
81	Demo File	Device_Telematry_Data - 1K.csv	Suite_12	Validation_12-20220428-094141	expect_column_values_to_be_between	validity	f	{"element_count": 19, "unexpected_count": 19, "unexpected_percent": 100.0, "partial_unexpected_list": [176.217853, 176.5589132, 185.4820432, 169.7108469, 165.0828994, 136.8785885, 156.0063913, 159.3793197, 223.8532964, 158.4212606, 174.6319508, 153.1061184, 152.3491534, 216.9135021, 154.3968637, 192.7839953, 180.186857, 179.8185164, 158.2820441], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 100.0, "unexpected_percent_nonmissing": 100.0, "partial_unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], "partial_unexpected_counts": [{"value": 136.8785885, "count": 1}, {"value": 152.3491534, "count": 1}, {"value": 153.1061184, "count": 1}, {"value": 154.3968637, "count": 1}, {"value": 156.0063913, "count": 1}, {"value": 158.2820441, "count": 1}, {"value": 158.4212606, "count": 1}, {"value": 159.3793197, "count": 1}, {"value": 165.0828994, "count": 1}, {"value": 169.7108469, "count": 1}, {"value": 174.6319508, "count": 1}, {"value": 176.217853, "count": 1}, {"value": 176.5589132, "count": 1}, {"value": 179.8185164, "count": 1}, {"value": 180.186857, "count": 1}, {"value": 185.4820432, "count": 1}, {"value": 192.7839953, "count": 1}, {"value": 216.9135021, "count": 1}, {"value": 223.8532964, "count": 1}], "unexpected_list": [176.217853, 176.5589132, 185.4820432, 169.7108469, 165.0828994, 136.8785885, 156.0063913, 159.3793197, 223.8532964, 158.4212606, 174.6319508, 153.1061184, 152.3491534, 216.9135021, 154.3968637, 192.7839953, 180.186857, 179.8185164, 158.2820441], "unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]}	2022-04-28 09:41:59.352162+00	2022-04-28 09:41:59.35217+00	{"kwargs": {"column": "volt", "cost": "150", "max_value": 100, "min_value": 0, "mostly": 0.8, "batch_id": "b3c90269c91d5315de1e62a6b1406a38"}, "meta": {}, "expectation_type": "expect_column_values_to_be_between"}	volt
82	Demo File	Device_Telematry_Data - 1K.csv	Suite_12	Validation_12-20220428-094141	expect_column_max_to_be_between	consistency	f	{"observed_value": 149.003582}	2022-04-28 09:41:59.352211+00	2022-04-28 09:41:59.352218+00	{"kwargs": {"column": "pressure", "cost": "20", "max_value": 100, "min_value": 0, "mostly": 0.8, "batch_id": "b3c90269c91d5315de1e62a6b1406a38"}, "meta": {}, "expectation_type": "expect_column_max_to_be_between"}	pressure
83	Demo File	Device_Telematry_Data - 1K.csv	Suite_14	Validation_14-20220428-095401	expect_column_values_to_be_of_type	accuracy	t	{"observed_value": "float64"}	2022-04-28 09:54:06.68594+00	2022-04-28 09:54:06.685969+00	{"kwargs": {"column": "pressure", "cost": "10", "mostly": 0.8, "type_": "float", "batch_id": "b3c90269c91d5315de1e62a6b1406a38"}, "meta": {}, "expectation_type": "expect_column_values_to_be_of_type"}	pressure
84	Demo File	Device_Telematry_Data - 1K.csv	Suite_14	Validation_14-20220428-095401	expect_column_values_to_not_be_null	completeness	t	{"element_count": 19, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-04-28 09:54:06.686014+00	2022-04-28 09:54:06.686022+00	{"kwargs": {"column": "device_id", "cost": "20", "mostly": 0.8, "batch_id": "b3c90269c91d5315de1e62a6b1406a38"}, "meta": {}, "expectation_type": "expect_column_values_to_not_be_null"}	device_id
85	Demo File	Device_Telematry_Data - 1K.csv	Suite_14	Validation_14-20220428-095401	expect_column_values_to_be_unique	uniqueness	f	{"element_count": 19, "unexpected_count": 18, "unexpected_percent": 94.73684210526315, "partial_unexpected_list": ["10.91.103.94", "34.91.103.95", "6.91.103.90", "2.91.103.80", "7.91.103.21", "34.102.103.6", "20.101.103.7", "34.91.105.99", "37.10.103.60", "37.10.103.60", "34.91.105.99", "20.101.103.7", "34.102.103.6", "7.91.103.21", "2.91.103.80", "6.91.103.90", "34.91.103.95", "10.91.103.94"], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 94.73684210526315, "unexpected_percent_nonmissing": 94.73684210526315, "partial_unexpected_index_list": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], "partial_unexpected_counts": [{"value": "10.91.103.94", "count": 2}, {"value": "2.91.103.80", "count": 2}, {"value": "20.101.103.7", "count": 2}, {"value": "34.102.103.6", "count": 2}, {"value": "34.91.103.95", "count": 2}, {"value": "34.91.105.99", "count": 2}, {"value": "37.10.103.60", "count": 2}, {"value": "6.91.103.90", "count": 2}, {"value": "7.91.103.21", "count": 2}], "unexpected_list": ["10.91.103.94", "34.91.103.95", "6.91.103.90", "2.91.103.80", "7.91.103.21", "34.102.103.6", "20.101.103.7", "34.91.105.99", "37.10.103.60", "37.10.103.60", "34.91.105.99", "20.101.103.7", "34.102.103.6", "7.91.103.21", "2.91.103.80", "6.91.103.90", "34.91.103.95", "10.91.103.94"], "unexpected_index_list": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]}	2022-04-28 09:54:06.686063+00	2022-04-28 09:54:06.68607+00	{"kwargs": {"column": "ip_address", "cost": "20", "mostly": 0.8, "batch_id": "b3c90269c91d5315de1e62a6b1406a38"}, "meta": {}, "expectation_type": "expect_column_values_to_be_unique"}	ip_address
86	Demo File	Device_Telematry_Data - 1K.csv	Suite_14	Validation_14-20220428-095401	expect_column_values_to_be_increasing	precision	t	{"element_count": 19, "unexpected_count": 7, "unexpected_percent": 36.84210526315789, "partial_unexpected_list": [452.2835762, 409.4192167, 397.3081267, 356.9288214, 450.4983412, 519.1661847, 432.3729603], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 36.84210526315789, "unexpected_percent_nonmissing": 36.84210526315789, "partial_unexpected_index_list": [4, 7, 8, 10, 14, 17, 18], "partial_unexpected_counts": [{"value": 356.9288214, "count": 1}, {"value": 397.3081267, "count": 1}, {"value": 409.4192167, "count": 1}, {"value": 432.3729603, "count": 1}, {"value": 450.4983412, "count": 1}, {"value": 452.2835762, "count": 1}, {"value": 519.1661847, "count": 1}], "unexpected_list": [452.2835762, 409.4192167, 397.3081267, 356.9288214, 450.4983412, 519.1661847, 432.3729603], "unexpected_index_list": [4, 7, 8, 10, 14, 17, 18]}	2022-04-28 09:54:06.686112+00	2022-04-28 09:54:06.686119+00	{"kwargs": {"column": "rotate", "cost": "30", "mostly": 0.2, "batch_id": "b3c90269c91d5315de1e62a6b1406a38"}, "meta": {}, "expectation_type": "expect_column_values_to_be_increasing"}	rotate
87	Demo File	Device_Telematry_Data - 1K.csv	Suite_14	Validation_14-20220428-095401	expect_column_values_to_be_between	validity	t	{"element_count": 19, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-04-28 09:54:06.68616+00	2022-04-28 09:54:06.686167+00	{"kwargs": {"column": "volt", "cost": "20", "max_value": 500, "min_value": 100, "mostly": 0.8, "batch_id": "b3c90269c91d5315de1e62a6b1406a38"}, "meta": {}, "expectation_type": "expect_column_values_to_be_between"}	volt
88	Demo File	Device_Telematry_Data - 1K.csv	Suite_14	Validation_14-20220428-095401	expect_column_min_to_be_between	consistency	t	{"observed_value": 136.8785885}	2022-04-28 09:54:06.686208+00	2022-04-28 09:54:06.686215+00	{"kwargs": {"column": "volt", "cost": "30", "max_value": 200, "min_value": 100, "mostly": 0.8, "batch_id": "b3c90269c91d5315de1e62a6b1406a38"}, "meta": {}, "expectation_type": "expect_column_min_to_be_between"}	volt
89	Demo File	Device_Telematry_Data - 1K.csv	Suite_15	Validation_15-20220528-103602	expect_column_values_to_be_increasing	precision	f	{}	2022-05-28 10:36:07.376641+00	2022-05-28 10:36:07.376667+00	{"kwargs": {"column": "ip_address", "cost": 0, "mostly": 0.2, "batch_id": "b3c90269c91d5315de1e62a6b1406a38"}, "meta": {}, "expectation_type": "expect_column_values_to_be_increasing"}	ip_address
90	Demo File	Device_Telematry_Data - 1K.csv	Suite_15	Validation_15-20220528-103602	expect_column_values_to_be_of_type	accuracy	t	{"element_count": 19, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 1, "missing_percent": 5.263157894736842, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-05-28 10:36:07.376712+00	2022-05-28 10:36:07.376719+00	{"kwargs": {"column": "device_status", "cost": "20", "mostly": 0.8, "type_": "str", "batch_id": "b3c90269c91d5315de1e62a6b1406a38"}, "meta": {}, "expectation_type": "expect_column_values_to_be_of_type"}	device_status
98	Demo File	Device_Telematry_Data - 1K.csv	Suite_17	Validation_17-20220628-104333	expect_column_values_to_be_increasing	precision	t	{"element_count": 19, "unexpected_count": 7, "unexpected_percent": 36.84210526315789, "partial_unexpected_list": [452.2835762, 409.4192167, 397.3081267, 356.9288214, 450.4983412, 519.1661847, 432.3729603], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 36.84210526315789, "unexpected_percent_nonmissing": 36.84210526315789, "partial_unexpected_index_list": [4, 7, 8, 10, 14, 17, 18], "partial_unexpected_counts": [{"value": 356.9288214, "count": 1}, {"value": 397.3081267, "count": 1}, {"value": 409.4192167, "count": 1}, {"value": 432.3729603, "count": 1}, {"value": 450.4983412, "count": 1}, {"value": 452.2835762, "count": 1}, {"value": 519.1661847, "count": 1}], "unexpected_list": [452.2835762, 409.4192167, 397.3081267, 356.9288214, 450.4983412, 519.1661847, 432.3729603], "unexpected_index_list": [4, 7, 8, 10, 14, 17, 18]}	2022-06-28 10:43:37.72058+00	2022-06-28 10:43:37.720588+00	{"kwargs": {"column": "rotate", "cost": 0, "mostly": 0.2, "batch_id": "b3c90269c91d5315de1e62a6b1406a38"}, "meta": {}, "expectation_type": "expect_column_values_to_be_increasing"}	rotate
99	Demo File	Device_Telematry_Data - 1K.csv	Suite_17	Validation_17-20220628-104333	expect_column_values_to_be_between	validity	t	{"element_count": 19, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-28 10:43:37.72063+00	2022-06-28 10:43:37.720637+00	{"kwargs": {"column": "volt", "cost": "10", "max_value": 1000, "min_value": 100, "mostly": 0.8, "batch_id": "b3c90269c91d5315de1e62a6b1406a38"}, "meta": {}, "expectation_type": "expect_column_values_to_be_between"}	volt
100	Demo File	Device_Telematry_Data - 1K.csv	Suite_18	Validation_18-20220628-104919	expect_column_min_to_be_between	consistency	t	{"observed_value": 136.8785885}	2022-06-28 10:49:23.895066+00	2022-06-28 10:49:23.895091+00	{"kwargs": {"column": "volt", "cost": "10", "max_value": 1000, "min_value": 0, "mostly": 0.8, "batch_id": "b3c90269c91d5315de1e62a6b1406a38"}, "meta": {}, "expectation_type": "expect_column_min_to_be_between"}	volt
101	Demo File	Device_Telematry_Data - 1K.csv	Suite_18	Validation_18-20220628-104919	expect_column_values_to_be_between	validity	t	{"element_count": 19, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-28 10:49:23.895136+00	2022-06-28 10:49:23.895143+00	{"kwargs": {"column": "volt", "cost": 0, "max_value": 1000, "min_value": 0, "mostly": 0.8, "batch_id": "b3c90269c91d5315de1e62a6b1406a38"}, "meta": {}, "expectation_type": "expect_column_values_to_be_between"}	volt
94	Demo File	Device_Telematry_Data - 1K.csv	Suite_15	Validation_15-20220528-103602	expect_column_median_to_be_between	consistency	f	{"observed_value": 463.6467269}	2022-05-28 10:36:07.376905+00	2022-05-28 10:36:07.376912+00	{"kwargs": {"column": "rotate", "cost": "30", "max_value": 100, "min_value": 0, "mostly": 0.8, "batch_id": "b3c90269c91d5315de1e62a6b1406a38"}, "meta": {}, "expectation_type": "expect_column_median_to_be_between"}	rotate
95	Demo File	Device_Telematry_Data - 1K.csv	Suite_16	Validation_16-20220528-103904	expect_column_values_to_be_increasing	precision	f	{}	2022-05-28 10:39:08.839829+00	2022-05-28 10:39:08.839855+00	{"kwargs": {"column": "timestamp", "cost": 0, "mostly": 0.1, "batch_id": "b3c90269c91d5315de1e62a6b1406a38"}, "meta": {}, "expectation_type": "expect_column_values_to_be_increasing"}	timestamp
96	Demo File	Device_Telematry_Data - 1K.csv	Suite_16	Validation_16-20220528-103904	expect_column_values_to_be_between	validity	t	{"element_count": 19, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-05-28 10:39:08.839907+00	2022-05-28 10:39:08.839915+00	{"kwargs": {"column": "volt", "cost": 0, "max_value": 1000, "min_value": 100, "mostly": 0.8, "batch_id": "b3c90269c91d5315de1e62a6b1406a38"}, "meta": {}, "expectation_type": "expect_column_values_to_be_between"}	volt
97	Demo File	Device_Telematry_Data - 1K.csv	Suite_17	Validation_17-20220628-104333	expect_column_values_to_be_of_type	accuracy	t	{"observed_value": "float64"}	2022-06-28 10:43:37.720505+00	2022-06-28 10:43:37.720536+00	{"kwargs": {"column": "rotate", "cost": "10", "mostly": 0.8, "type_": "float", "batch_id": "b3c90269c91d5315de1e62a6b1406a38"}, "meta": {}, "expectation_type": "expect_column_values_to_be_of_type"}	rotate
102	Demo File	Device_Telematry_Data - 1K.csv	Suite_18	Validation_18-20220628-104919	expect_column_values_to_be_increasing	precision	t	{"element_count": 19, "unexpected_count": 7, "unexpected_percent": 36.84210526315789, "partial_unexpected_list": [452.2835762, 409.4192167, 397.3081267, 356.9288214, 450.4983412, 519.1661847, 432.3729603], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 36.84210526315789, "unexpected_percent_nonmissing": 36.84210526315789, "partial_unexpected_index_list": [4, 7, 8, 10, 14, 17, 18], "partial_unexpected_counts": [{"value": 356.9288214, "count": 1}, {"value": 397.3081267, "count": 1}, {"value": 409.4192167, "count": 1}, {"value": 432.3729603, "count": 1}, {"value": 450.4983412, "count": 1}, {"value": 452.2835762, "count": 1}, {"value": 519.1661847, "count": 1}], "unexpected_list": [452.2835762, 409.4192167, 397.3081267, 356.9288214, 450.4983412, 519.1661847, 432.3729603], "unexpected_index_list": [4, 7, 8, 10, 14, 17, 18]}	2022-06-28 10:49:23.895184+00	2022-06-28 10:49:23.895192+00	{"kwargs": {"column": "rotate", "cost": 0, "mostly": 0.1, "batch_id": "b3c90269c91d5315de1e62a6b1406a38"}, "meta": {}, "expectation_type": "expect_column_values_to_be_increasing"}	rotate
103	Demo File	Device_Telematry_Data - 1K.csv	Suite_18	Validation_18-20220628-104945	expect_column_min_to_be_between	consistency	t	{"observed_value": 136.8785885}	2022-06-28 10:49:49.553123+00	2022-06-28 10:49:49.553151+00	{"kwargs": {"column": "volt", "cost": "10", "max_value": 1000, "min_value": 0, "mostly": 0.8, "batch_id": "b3c90269c91d5315de1e62a6b1406a38"}, "meta": {}, "expectation_type": "expect_column_min_to_be_between"}	volt
104	Demo File	Device_Telematry_Data - 1K.csv	Suite_18	Validation_18-20220628-104945	expect_column_values_to_be_between	validity	t	{"element_count": 19, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-28 10:49:49.553198+00	2022-06-28 10:49:49.553206+00	{"kwargs": {"column": "volt", "cost": 0, "max_value": 1000, "min_value": 0, "mostly": 0.8, "batch_id": "b3c90269c91d5315de1e62a6b1406a38"}, "meta": {}, "expectation_type": "expect_column_values_to_be_between"}	volt
105	Demo File	Device_Telematry_Data - 1K.csv	Suite_18	Validation_18-20220628-104945	expect_column_values_to_be_increasing	precision	t	{"element_count": 19, "unexpected_count": 7, "unexpected_percent": 36.84210526315789, "partial_unexpected_list": [452.2835762, 409.4192167, 397.3081267, 356.9288214, 450.4983412, 519.1661847, 432.3729603], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 36.84210526315789, "unexpected_percent_nonmissing": 36.84210526315789, "partial_unexpected_index_list": [4, 7, 8, 10, 14, 17, 18], "partial_unexpected_counts": [{"value": 356.9288214, "count": 1}, {"value": 397.3081267, "count": 1}, {"value": 409.4192167, "count": 1}, {"value": 432.3729603, "count": 1}, {"value": 450.4983412, "count": 1}, {"value": 452.2835762, "count": 1}, {"value": 519.1661847, "count": 1}], "unexpected_list": [452.2835762, 409.4192167, 397.3081267, 356.9288214, 450.4983412, 519.1661847, 432.3729603], "unexpected_index_list": [4, 7, 8, 10, 14, 17, 18]}	2022-06-28 10:49:49.553412+00	2022-06-28 10:49:49.553426+00	{"kwargs": {"column": "rotate", "cost": 0, "mostly": 0.1, "batch_id": "b3c90269c91d5315de1e62a6b1406a38"}, "meta": {}, "expectation_type": "expect_column_values_to_be_increasing"}	rotate
92	Demo File	Device_Telematry_Data - 1K.csv	Suite_15	Validation_15-20220528-103602	expect_column_values_to_be_decreasing	precision	f	{"element_count": 19, "unexpected_count": 11, "unexpected_percent": 57.89473684210527, "partial_unexpected_list": [424.6241621, 461.2111374, 463.6467269, 492.0884196, 519.4979051, 500.8308855, 478.4097577, 504.9095338, 510.5411089, 515.3896733, 538.763646], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 57.89473684210527, "unexpected_percent_nonmissing": 57.89473684210527, "partial_unexpected_index_list": [1, 2, 3, 5, 6, 9, 11, 12, 13, 15, 16], "partial_unexpected_counts": [{"value": 424.6241621, "count": 1}, {"value": 461.2111374, "count": 1}, {"value": 463.6467269, "count": 1}, {"value": 478.4097577, "count": 1}, {"value": 492.0884196, "count": 1}, {"value": 500.8308855, "count": 1}, {"value": 504.9095338, "count": 1}, {"value": 510.5411089, "count": 1}, {"value": 515.3896733, "count": 1}, {"value": 519.4979051, "count": 1}, {"value": 538.763646, "count": 1}], "unexpected_list": [424.6241621, 461.2111374, 463.6467269, 492.0884196, 519.4979051, 500.8308855, 478.4097577, 504.9095338, 510.5411089, 515.3896733, 538.763646], "unexpected_index_list": [1, 2, 3, 5, 6, 9, 11, 12, 13, 15, 16]}	2022-05-28 10:36:07.376808+00	2022-05-28 10:36:07.376816+00	{"kwargs": {"column": "rotate", "cost": "20", "mostly": 0.8, "batch_id": "b3c90269c91d5315de1e62a6b1406a38"}, "meta": {}, "expectation_type": "expect_column_values_to_be_decreasing"}	rotate
93	Demo File	Device_Telematry_Data - 1K.csv	Suite_15	Validation_15-20220528-103602	expect_column_values_to_be_between	validity	f	{"element_count": 19, "unexpected_count": 19, "unexpected_percent": 100.0, "partial_unexpected_list": [418.5040782, 424.6241621, 461.2111374, 463.6467269, 452.2835762, 492.0884196, 519.4979051, 409.4192167, 397.3081267, 500.8308855, 356.9288214, 478.4097577, 504.9095338, 510.5411089, 450.4983412, 515.3896733, 538.763646, 519.1661847, 432.3729603], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 100.0, "unexpected_percent_nonmissing": 100.0, "partial_unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], "partial_unexpected_counts": [{"value": 356.9288214, "count": 1}, {"value": 397.3081267, "count": 1}, {"value": 409.4192167, "count": 1}, {"value": 418.5040782, "count": 1}, {"value": 424.6241621, "count": 1}, {"value": 432.3729603, "count": 1}, {"value": 450.4983412, "count": 1}, {"value": 452.2835762, "count": 1}, {"value": 461.2111374, "count": 1}, {"value": 463.6467269, "count": 1}, {"value": 478.4097577, "count": 1}, {"value": 492.0884196, "count": 1}, {"value": 500.8308855, "count": 1}, {"value": 504.9095338, "count": 1}, {"value": 510.5411089, "count": 1}, {"value": 515.3896733, "count": 1}, {"value": 519.1661847, "count": 1}, {"value": 519.4979051, "count": 1}, {"value": 538.763646, "count": 1}], "unexpected_list": [418.5040782, 424.6241621, 461.2111374, 463.6467269, 452.2835762, 492.0884196, 519.4979051, 409.4192167, 397.3081267, 500.8308855, 356.9288214, 478.4097577, 504.9095338, 510.5411089, 450.4983412, 515.3896733, 538.763646, 519.1661847, 432.3729603], "unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]}	2022-05-28 10:36:07.376856+00	2022-05-28 10:36:07.376864+00	{"kwargs": {"column": "rotate", "cost": "26", "max_value": 100, "min_value": 0, "mostly": 0.9, "batch_id": "b3c90269c91d5315de1e62a6b1406a38"}, "meta": {}, "expectation_type": "expect_column_values_to_be_between"}	rotate
106	Demo File	Device_Telematry_Data - 1K.csv	Demo_10000	Validation_1000-20220629-150152	expect_column_values_to_not_be_null	completeness	t	{"element_count": 19, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-06-29 15:02:02.531518+00	2022-06-29 15:02:02.535832+00	{"kwargs": {"column": "device_id", "cost": "10", "mostly": 1, "batch_id": "b3c90269c91d5315de1e62a6b1406a38"}, "meta": {}, "expectation_type": "expect_column_values_to_not_be_null"}	device_id
120	De	telemetry_hourly_change.csv	DEMO1	DEmo-20220704-080231	expect_table_columns_to_match_ordered_list	accuracy	f	{"observed_value": ["timestamp", "uv", "temperature", "humidity", "volt", "rotate", "pressure", "vibration"], "details": {"mismatched": [{"Expected Column Position": 0, "Expected": "column_list", "Found": "timestamp"}, {"Expected Column Position": 1, "Expected": null, "Found": "uv"}, {"Expected Column Position": 2, "Expected": null, "Found": "temperature"}, {"Expected Column Position": 3, "Expected": null, "Found": "humidity"}, {"Expected Column Position": 4, "Expected": null, "Found": "volt"}, {"Expected Column Position": 5, "Expected": null, "Found": "rotate"}, {"Expected Column Position": 6, "Expected": null, "Found": "pressure"}, {"Expected Column Position": 7, "Expected": null, "Found": "vibration"}]}}	2022-07-04 08:03:08.7214+00	2022-07-04 08:03:08.7214+00	{"expectation_type": "expect_table_columns_to_match_ordered_list", "kwargs": {"column": "timestamp", "column_list": ["column_list"], "cost": 0, "mostly": 0.8, "batch_id": "134b56d441ef28aaaa02d9679ab566a0"}, "meta": {}}	timestamp
107	Demo File	Device_Telematry_Data - 1K.csv	Demo_10000	Validation_1000-20220629-150152	expect_column_values_to_be_unique	uniqueness	f	{"element_count": 19, "unexpected_count": 19, "unexpected_percent": 100.0, "partial_unexpected_list": ["01-01-21 6:00", "01-01-21 6:00", "01-01-21 6:00", "01-01-21 6:00", "01-01-21 6:00", "01-01-21 6:00", "01-01-21 6:00", "01-01-21 6:00", "01-01-21 6:00", "01-01-21 6:00", "01-01-21 7:00", "01-01-21 7:00", "01-01-21 7:00", "01-01-21 7:00", "01-01-21 7:00", "01-01-21 7:00", "01-01-21 7:00", "01-01-21 7:00", "01-01-21 7:00"], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 100.0, "unexpected_percent_nonmissing": 100.0, "partial_unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], "partial_unexpected_counts": [{"value": "01-01-21 6:00", "count": 10}, {"value": "01-01-21 7:00", "count": 9}], "unexpected_list": ["01-01-21 6:00", "01-01-21 6:00", "01-01-21 6:00", "01-01-21 6:00", "01-01-21 6:00", "01-01-21 6:00", "01-01-21 6:00", "01-01-21 6:00", "01-01-21 6:00", "01-01-21 6:00", "01-01-21 7:00", "01-01-21 7:00", "01-01-21 7:00", "01-01-21 7:00", "01-01-21 7:00", "01-01-21 7:00", "01-01-21 7:00", "01-01-21 7:00", "01-01-21 7:00"], "unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]}	2022-06-29 15:02:02.536049+00	2022-06-29 15:02:02.536065+00	{"kwargs": {"column": "timestamp", "cost": 0, "mostly": 0.8, "batch_id": "b3c90269c91d5315de1e62a6b1406a38"}, "meta": {}, "expectation_type": "expect_column_values_to_be_unique"}	timestamp
108	local	Customer_OrderData.csv	suite_2	checkpoint_1-20220704-072029	expect_column_values_to_be_of_type	accuracy	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-07-04 07:21:01.967664+00	2022-07-04 07:21:01.967664+00	{"meta": {}, "expectation_type": "expect_column_values_to_be_of_type", "kwargs": {"column": "Name", "cost": 0, "mostly": 0.8, "type_": "str", "batch_id": "5cc261183f174463f79c5e6acd5915a5"}}	Name
109	local	Customer_OrderData.csv	suite_2	checkpoint_1-20220704-072029	expect_column_values_to_be_unique	uniqueness	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-07-04 07:21:01.967664+00	2022-07-04 07:21:01.967664+00	{"meta": {}, "expectation_type": "expect_column_values_to_be_unique", "kwargs": {"column": "Email Address", "cost": "10", "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}}	Email Address
110	local	Customer_OrderData.csv	suite_2	checkpoint_1-20220704-072029	expect_column_values_to_be_between	validity	f	{"element_count": 120, "unexpected_count": 120, "unexpected_percent": 100.0, "partial_unexpected_list": [6.92, 35.84, 364.69, 35.84, 31.79, 6.92, 31.79, 31.79, 524.96, 263.33, 6.92, 263.33, 97.44, 35.84, 56.67, 56.67, 524.96, 263.33, 263.33, 56.67], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 100.0, "unexpected_percent_nonmissing": 100.0, "partial_unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], "partial_unexpected_counts": [{"value": 263.33, "count": 17}, {"value": 6.92, "count": 14}, {"value": 31.79, "count": 12}, {"value": 502.54, "count": 12}, {"value": 35.84, "count": 11}, {"value": 117.11, "count": 10}, {"value": 56.67, "count": 9}, {"value": 159.42, "count": 9}, {"value": 364.69, "count": 9}, {"value": 524.96, "count": 9}, {"value": 97.44, "count": 5}, {"value": 90.93, "count": 3}], "unexpected_list": [6.92, 35.84, 364.69, 35.84, 31.79, 6.92, 31.79, 31.79, 524.96, 263.33, 6.92, 263.33, 97.44, 35.84, 56.67, 56.67, 524.96, 263.33, 263.33, 56.67, 524.96, 502.54, 90.93, 263.33, 159.42, 524.96, 263.33, 502.54, 524.96, 502.54, 31.79, 6.92, 97.44, 502.54, 97.44, 263.33, 56.67, 502.54, 263.33, 502.54, 35.84, 35.84, 117.11, 31.79, 502.54, 263.33, 35.84, 263.33, 364.69, 6.92, 364.69, 502.54, 524.96, 263.33, 364.69, 364.69, 35.84, 117.11, 31.79, 117.11, 56.67, 6.92, 117.11, 524.96, 6.92, 31.79, 117.11, 31.79, 159.42, 90.93, 6.92, 502.54, 31.79, 56.67, 35.84, 159.42, 6.92, 31.79, 35.84, 117.11, 6.92, 502.54, 56.67, 159.42, 6.92, 159.42, 524.96, 6.92, 6.92, 117.11, 364.69, 35.84, 56.67, 263.33, 31.79, 159.42, 364.69, 364.69, 117.11, 159.42, 263.33, 6.92, 117.11, 159.42, 97.44, 502.54, 263.33, 90.93, 502.54, 159.42, 56.67, 263.33, 31.79, 524.96, 364.69, 35.84, 97.44, 117.11, 263.33, 263.33], "unexpected_index_list": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119]}	2022-07-04 07:21:01.967664+00	2022-07-04 07:21:01.967664+00	{"meta": {}, "expectation_type": "expect_column_values_to_be_between", "kwargs": {"column": "Unit Cost", "cost": "10", "max_value": 1000000, "min_value": 10000, "mostly": 0.8, "batch_id": "5cc261183f174463f79c5e6acd5915a5"}}	Unit Cost
111	local	Customer_OrderData.csv	DEmo	DEmo-20220704-072524	expect_column_values_to_be_of_type	accuracy	f	{}	2022-07-04 07:25:59.955427+00	2022-07-04 07:25:59.955427+00	{"meta": {}, "expectation_type": "expect_column_values_to_be_of_type", "kwargs": {"column": "Name", "cost": 0, "mostly": 0.8, "type_": "type", "batch_id": "5cc261183f174463f79c5e6acd5915a5"}}	Name
112	local	Customer_OrderData.csv	DEmo	DEmo-20220704-072524	expect_column_values_to_be_of_type	accuracy	f	{}	2022-07-04 07:25:59.955427+00	2022-07-04 07:25:59.955427+00	{"meta": {}, "expectation_type": "expect_column_values_to_be_of_type", "kwargs": {"column": "Address ", "cost": 0, "mostly": 0.8, "type_": "type", "batch_id": "5cc261183f174463f79c5e6acd5915a5"}}	Address 
113	DB	public.auth_user	suite_7	DEmo-20220704-073033	expect_column_values_to_be_increasing	precision	f	{}	2022-07-04 07:30:57.204697+00	2022-07-04 07:30:57.204697+00	{"meta": {}, "expectation_type": "expect_column_values_to_be_increasing", "kwargs": {"column": "uv", "cost": 0, "mostly": 0.8, "batch_id": "c4117383971fe9d6a0cc75a492d8c643"}}	uv
114	DB	public.auth_user	suite_7	DEmo-20220704-073033	expect_column_values_to_be_unique	uniqueness	f	{}	2022-07-04 07:30:57.204697+00	2022-07-04 07:30:57.204697+00	{"meta": {}, "expectation_type": "expect_column_values_to_be_unique", "kwargs": {"column": "rotate", "cost": 0, "mostly": 0.8, "batch_id": "c4117383971fe9d6a0cc75a492d8c643"}}	rotate
115	DB	public.auth_user	suite_7	DEmo-20220704-073033	expect_column_values_to_be_between	validity	f	{}	2022-07-04 07:30:57.204697+00	2022-07-04 07:30:57.204697+00	{"meta": {}, "expectation_type": "expect_column_values_to_be_between", "kwargs": {"column": "volt", "cost": 0, "max_value": 400, "min_value": 100, "mostly": 0.8, "batch_id": "c4117383971fe9d6a0cc75a492d8c643"}}	volt
116	DB	public.auth_user	suite_7	DEmo-20220704-073033	expect_column_values_to_be_of_type	accuracy	f	{}	2022-07-04 07:30:57.204697+00	2022-07-04 07:30:57.204697+00	{"meta": {}, "expectation_type": "expect_column_values_to_be_of_type", "kwargs": {"column": "temperature", "cost": 0, "mostly": 0.8, "type_": "int", "batch_id": "c4117383971fe9d6a0cc75a492d8c643"}}	temperature
119	De	telemetry_hourly_change.csv	DEMO1	DEmo-20220704-080231	expect_column_values_to_be_of_type	accuracy	f	{}	2022-07-04 08:03:08.7214+00	2022-07-04 08:03:08.7214+00	{"expectation_type": "expect_column_values_to_be_of_type", "kwargs": {"column": "timestamp", "cost": 0, "mostly": 0.8, "type_": "type", "batch_id": "134b56d441ef28aaaa02d9679ab566a0"}, "meta": {}}	timestamp
121	local	Device_Telemetry_Daily.csv	Demo11	DEmo11-20220704-082138	expect_column_values_to_be_of_type	accuracy	f	{"observed_value": "float64"}	2022-07-04 08:22:16.588705+00	2022-07-04 08:22:16.588705+00	{"expectation_type": "expect_column_values_to_be_of_type", "kwargs": {"column": "vibration", "cost": 0, "mostly": 0.8, "type_": "type", "batch_id": "ef88d3180d3bdb48c4ae3728585294b7"}, "meta": {}}	vibration
122	local	Customer_OrderData.csv	sample_suite	SAMPLE_RUN-20220704-110905	expect_column_values_to_be_of_type	accuracy	t	{"element_count": 120, "unexpected_count": 0, "unexpected_percent": 0.0, "partial_unexpected_list": [], "missing_count": 0, "missing_percent": 0.0, "unexpected_percent_total": 0.0, "unexpected_percent_nonmissing": 0.0, "partial_unexpected_index_list": [], "partial_unexpected_counts": [], "unexpected_list": [], "unexpected_index_list": []}	2022-07-04 11:09:43.251261+00	2022-07-04 11:09:43.252261+00	{"meta": {}, "kwargs": {"column": "Name", "cost": 0, "mostly": 0.8, "type_": "str", "batch_id": "5cc261183f174463f79c5e6acd5915a5"}, "expectation_type": "expect_column_values_to_be_of_type"}	Name
\.


--
-- Data for Name: ge_api_rule; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.ge_api_rule (id, name, json, threshold, created_at, updated_at, cde_id_id, rule_model_id_id) FROM stdin;
\.


--
-- Data for Name: ge_api_rulemodel; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.ge_api_rulemodel (id, name, json, example, default_threshold, description, created_at, updated_at, dq_dimension_id_id) FROM stdin;
\.


--
-- Data for Name: ge_checkpoint_store; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.ge_checkpoint_store (checkpoint_name, value) FROM stdin;
checkpoint_1	name: checkpoint_1\nconfig_version: 1.0\ntemplate_name:\nmodule_name: great_expectations.checkpoint\nclass_name: Checkpoint\nrun_name_template: checkpoint_1-%Y%m%d-%H%M%S\nexpectation_suite_name:\nbatch_request: {}\naction_list:\n  - name: store_validation_result\n    action:\n      class_name: StoreValidationResultAction\n  - name: store_evaluation_params\n    action:\n      class_name: StoreEvaluationParametersAction\n  - name: update_data_docs\n    action:\n      class_name: UpdateDataDocsAction\n      site_names: []\nevaluation_parameters: {}\nruntime_configuration: {}\nvalidations:\n  - batch_request:\n      datasource_name: local\n      data_connector_name: default_inferred_data_connector_name\n      data_asset_name: Customer_OrderData.csv\n      data_connector_query:\n        index: -1\n    expectation_suite_name: suite_2\nprofilers: []\nge_cloud_id:\nexpectation_suite_ge_cloud_id:\n
checkpoint_2	name: checkpoint_2\nconfig_version: 1.0\ntemplate_name:\nmodule_name: great_expectations.checkpoint\nclass_name: Checkpoint\nrun_name_template: checkpoint_2-%Y%m%d-%H%M%S\nexpectation_suite_name:\nbatch_request: {}\naction_list:\n  - name: store_validation_result\n    action:\n      class_name: StoreValidationResultAction\n  - name: store_evaluation_params\n    action:\n      class_name: StoreEvaluationParametersAction\n  - name: update_data_docs\n    action:\n      class_name: UpdateDataDocsAction\n      site_names: []\nevaluation_parameters: {}\nruntime_configuration: {}\nvalidations:\n  - batch_request:\n      datasource_name: local2\n      data_connector_name: default_inferred_data_connector_name\n      data_asset_name: Customer_OrderData.csv\n      data_connector_query:\n        index: -1\n    expectation_suite_name: suite_2\nprofilers: []\nge_cloud_id:\nexpectation_suite_ge_cloud_id:\n
checkpoint3	name: checkpoint3\nconfig_version: 1.0\ntemplate_name:\nmodule_name: great_expectations.checkpoint\nclass_name: Checkpoint\nrun_name_template: checkpoint3-%Y%m%d-%H%M%S\nexpectation_suite_name:\nbatch_request: {}\naction_list:\n  - name: store_validation_result\n    action:\n      class_name: StoreValidationResultAction\n  - name: store_evaluation_params\n    action:\n      class_name: StoreEvaluationParametersAction\n  - name: update_data_docs\n    action:\n      class_name: UpdateDataDocsAction\n      site_names: []\nevaluation_parameters: {}\nruntime_configuration: {}\nvalidations:\n  - batch_request:\n      datasource_name: local\n      data_connector_name: default_inferred_data_connector_name\n      data_asset_name: Customer_OrderData.csv\n      data_connector_query:\n        index: -1\n    expectation_suite_name: suite_3\nprofilers: []\nge_cloud_id:\nexpectation_suite_ge_cloud_id:\n
DEmo	name: DEmo\nconfig_version: 1.0\ntemplate_name:\nmodule_name: great_expectations.checkpoint\nclass_name: Checkpoint\nrun_name_template: DEmo-%Y%m%d-%H%M%S\nexpectation_suite_name:\nbatch_request: {}\naction_list:\n  - name: store_validation_result\n    action:\n      class_name: StoreValidationResultAction\n  - name: store_evaluation_params\n    action:\n      class_name: StoreEvaluationParametersAction\n  - name: update_data_docs\n    action:\n      class_name: UpdateDataDocsAction\n      site_names: []\nevaluation_parameters: {}\nruntime_configuration: {}\nvalidations:\n  - batch_request:\n      datasource_name: DB\n      data_connector_name: default_inferred_data_connector_name\n      data_asset_name: public.ge_datasources_store\n      data_connector_query:\n        index: -1\n    expectation_suite_name: suite_5\nprofilers: []\nge_cloud_id:\nexpectation_suite_ge_cloud_id:\n
DEmo1	name: DEmo1\nconfig_version: 1.0\ntemplate_name:\nmodule_name: great_expectations.checkpoint\nclass_name: Checkpoint\nrun_name_template: DEmo1-%Y%m%d-%H%M%S\nexpectation_suite_name:\nbatch_request: {}\naction_list:\n  - name: store_validation_result\n    action:\n      class_name: StoreValidationResultAction\n  - name: store_evaluation_params\n    action:\n      class_name: StoreEvaluationParametersAction\n  - name: update_data_docs\n    action:\n      class_name: UpdateDataDocsAction\n      site_names: []\nevaluation_parameters: {}\nruntime_configuration: {}\nvalidations:\n  - batch_request:\n      datasource_name: De\n      data_connector_name: default_inferred_data_connector_name\n      data_asset_name: telemetry_hourly_change.csv\n      data_connector_query:\n        index: -1\n    expectation_suite_name: suite_2\nprofilers: []\nge_cloud_id:\nexpectation_suite_ge_cloud_id:\n
checkpoint	name: checkpoint\nconfig_version: 1.0\ntemplate_name:\nmodule_name: great_expectations.checkpoint\nclass_name: Checkpoint\nrun_name_template: checkpoint-%Y%m%d-%H%M%S\nexpectation_suite_name:\nbatch_request: {}\naction_list:\n  - name: store_validation_result\n    action:\n      class_name: StoreValidationResultAction\n  - name: store_evaluation_params\n    action:\n      class_name: StoreEvaluationParametersAction\n  - name: update_data_docs\n    action:\n      class_name: UpdateDataDocsAction\n      site_names: []\nevaluation_parameters: {}\nruntime_configuration: {}\nvalidations:\n  - batch_request:\n      datasource_name: local\n      data_connector_name: default_inferred_data_connector_name\n      data_asset_name: Device_Telemetry_Daily.csv\n      data_connector_query:\n        index: -1\n    expectation_suite_name: Demo11\nprofilers: []\nge_cloud_id:\nexpectation_suite_ge_cloud_id:\n
\.


--
-- Data for Name: ge_datasources_store; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.ge_datasources_store (datasource_name, type, json, value) FROM stdin;
local	local_file	{"name": "local", "datasource_type": "local_file"}	{"name": "local", "class_name": "Datasource", "module_name": "great_expectations.datasource", "execution_engine": {"module_name": "great_expectations.execution_engine", "class_name": "PandasExecutionEngine"}, "data_connectors": {"default_inferred_data_connector_name": {"class_name": "InferredAssetFilesystemDataConnector", "base_directory": "ge_core/temp/local", "default_regex": {"group_names": ["data_asset_name"], "pattern": "(.*)"}}}}
local2	local_file	{"name": "local2", "datasource_type": "local_file"}	{"name": "local2", "class_name": "Datasource", "module_name": "great_expectations.datasource", "execution_engine": {"module_name": "great_expectations.execution_engine", "class_name": "PandasExecutionEngine"}, "data_connectors": {"default_inferred_data_connector_name": {"class_name": "InferredAssetFilesystemDataConnector", "base_directory": "ge_core/temp/local2", "default_regex": {"group_names": ["data_asset_name"], "pattern": "(.*)"}}}}
DB	database	{"name": "DB", "datasource_type": "database", "database_name": "postgresql", "pg_username": "postgres", "pg_password": "mypostpass123", "pg_host": "localhost", "pg_port": "5432", "pg_database": "DQC_DB"}	{"name": "DB", "class_name": "Datasource", "execution_engine": {"class_name": "SqlAlchemyExecutionEngine", "connection_string": "postgresql+psycopg2://postgres:mypostpass123@localhost:5432/DQC_DB"}, "data_connectors": {"default_runtime_data_connector_name": {"class_name": "RuntimeDataConnector", "batch_identifiers": ["default_identifier_name"]}, "default_inferred_data_connector_name": {"class_name": "InferredAssetSqlDataConnector", "include_schema_name": true}}}
Demo File	local_file	{"name": "Demo File", "datasource_type": "local_file"}	{"name": "Demo File", "class_name": "Datasource", "module_name": "great_expectations.datasource", "execution_engine": {"module_name": "great_expectations.execution_engine", "class_name": "PandasExecutionEngine"}, "data_connectors": {"default_inferred_data_connector_name": {"class_name": "InferredAssetFilesystemDataConnector", "base_directory": "ge_core/temp/Demo File", "default_regex": {"group_names": ["data_asset_name"], "pattern": "(.*)"}}}}
Telemetry_Data	local_file	{"name": "Telemetry_Data", "datasource_type": "local_file"}	{"name": "Telemetry_Data", "class_name": "Datasource", "module_name": "great_expectations.datasource", "execution_engine": {"module_name": "great_expectations.execution_engine", "class_name": "PandasExecutionEngine"}, "data_connectors": {"default_inferred_data_connector_name": {"class_name": "InferredAssetFilesystemDataConnector", "base_directory": "ge_core/temp/Telemetry_Data", "default_regex": {"group_names": ["data_asset_name"], "pattern": "(.*)"}}}}
De	local_file	{"name": "De", "datasource_type": "local_file"}	{"name": "De", "class_name": "Datasource", "module_name": "great_expectations.datasource", "execution_engine": {"module_name": "great_expectations.execution_engine", "class_name": "PandasExecutionEngine"}, "data_connectors": {"default_inferred_data_connector_name": {"class_name": "InferredAssetFilesystemDataConnector", "base_directory": "ge_core/temp/De", "default_regex": {"group_names": ["data_asset_name"], "pattern": "(.*)"}}}}
menu	database	{"name": "menu", "datasource_type": "database", "database_name": "postgresql", "pg_username": "decdpdev", "pg_password": "postgres@2022", "pg_host": "prathampostgresql.postgres.database.azure.com", "pg_port": "5432", "pg_database": "graviton"}	{"name": "menu", "class_name": "Datasource", "execution_engine": {"class_name": "SqlAlchemyExecutionEngine", "connection_string": "postgresql+psycopg2://decdpdev:postgres%402022@prathampostgresql.postgres.database.azure.com:5432/graviton"}, "data_connectors": {"default_runtime_data_connector_name": {"class_name": "RuntimeDataConnector", "batch_identifiers": ["default_identifier_name"]}, "default_inferred_data_connector_name": {"class_name": "InferredAssetSqlDataConnector", "include_schema_name": true}}}
\.


--
-- Data for Name: ge_expectations_store; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.ge_expectations_store (expectation_suite_name, value) FROM stdin;
Demo11	{\n  "data_asset_type": null,\n  "expectation_suite_name": "Demo11",\n  "expectations": [\n    {\n      "expectation_type": "expect_column_values_to_be_of_type",\n      "kwargs": {\n        "column": "vibration",\n        "cost": 0,\n        "mostly": 0.8,\n        "type_": "type"\n      },\n      "meta": {}\n    }\n  ],\n  "ge_cloud_id": null,\n  "meta": {\n    "great_expectations_version": "0.15.12"\n  }\n}
suite_2	{\n  "data_asset_type": null,\n  "expectation_suite_name": "suite_2",\n  "expectations": [\n    {\n      "expectation_type": "expect_column_values_to_be_of_type",\n      "kwargs": {\n        "column": "Name",\n        "cost": 0,\n        "mostly": 0.8,\n        "type_": "str"\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_values_to_be_unique",\n      "kwargs": {\n        "column": "Email Address",\n        "cost": "10",\n        "mostly": 0.8\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_values_to_be_between",\n      "kwargs": {\n        "column": "Unit Cost",\n        "cost": "10",\n        "max_value": 1000000,\n        "min_value": 10000,\n        "mostly": 0.8\n      },\n      "meta": {}\n    }\n  ],\n  "ge_cloud_id": null,\n  "meta": {\n    "great_expectations_version": "0.15.7"\n  }\n}
suite_3	{\n  "data_asset_type": null,\n  "expectation_suite_name": "suite_3",\n  "expectations": [\n    {\n      "expectation_type": "expect_column_values_to_be_of_type",\n      "kwargs": {\n        "column": "Name",\n        "cost": "10",\n        "mostly": 0.8,\n        "type_": "str"\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_values_to_not_be_null",\n      "kwargs": {\n        "column": "Total Revenue",\n        "cost": 0,\n        "mostly": 0.8\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_values_to_be_increasing",\n      "kwargs": {\n        "column": "Order ID",\n        "cost": 0,\n        "mostly": 0.8\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_values_to_be_between",\n      "kwargs": {\n        "column": "Unit Cost",\n        "cost": 0,\n        "max_value": 1000000,\n        "min_value": 1000,\n        "mostly": 0.8\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_min_to_be_between",\n      "kwargs": {\n        "column": "Unit Cost",\n        "cost": 0,\n        "max_value": 2000,\n        "min_value": 1000,\n        "mostly": 0.8\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_unique_value_count_to_be_between",\n      "kwargs": {\n        "column": "Extra ",\n        "cost": 0,\n        "max_value": 100,\n        "min_value": 0,\n        "mostly": 0.8\n      },\n      "meta": {}\n    }\n  ],\n  "ge_cloud_id": null,\n  "meta": {\n    "great_expectations_version": "0.15.7"\n  }\n}
suite_1	{\n  "data_asset_type": null,\n  "expectation_suite_name": "suite_1",\n  "expectations": [\n    {\n      "expectation_type": "expect_column_values_to_be_of_type",\n      "kwargs": {\n        "column": "Name",\n        "cost": 0,\n        "mostly": 0.8,\n        "type_": "str"\n      },\n      "meta": {}\n    }\n  ],\n  "ge_cloud_id": null,\n  "meta": {\n    "great_expectations_version": "0.15.7"\n  }\n}
suite_4	{\n  "data_asset_type": null,\n  "expectation_suite_name": "suite_4",\n  "expectations": [\n    {\n      "expectation_type": "expect_column_values_to_be_of_type",\n      "kwargs": {\n        "column": "humidity",\n        "cost": 0,\n        "mostly": 0.8,\n        "type_": "float"\n      },\n      "meta": {}\n    }\n  ],\n  "ge_cloud_id": null,\n  "meta": {\n    "great_expectations_version": "0.15.7"\n  }\n}
suite_5	{\n  "data_asset_type": null,\n  "expectation_suite_name": "suite_5",\n  "expectations": [\n    {\n      "expectation_type": "expect_column_values_to_be_increasing",\n      "kwargs": {\n        "column": "volt",\n        "cost": 0,\n        "mostly": 0.8\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_median_to_be_between",\n      "kwargs": {\n        "column": "humidity",\n        "cost": 0,\n        "max_value": 100,\n        "min_value": 0,\n        "mostly": 0.8\n      },\n      "meta": {}\n    }\n  ],\n  "ge_cloud_id": null,\n  "meta": {\n    "great_expectations_version": "0.15.7"\n  }\n}
suite_6	{\n  "data_asset_type": null,\n  "expectation_suite_name": "suite_6",\n  "expectations": [\n    {\n      "expectation_type": "expect_column_values_to_be_of_type",\n      "kwargs": {\n        "column": "Name",\n        "cost": 0,\n        "mostly": 0.8,\n        "type_": "str"\n      },\n      "meta": {}\n    }\n  ],\n  "ge_cloud_id": null,\n  "meta": {\n    "great_expectations_version": "0.15.7"\n  }\n}
suite_7	{\n  "data_asset_type": null,\n  "expectation_suite_name": "suite_7",\n  "expectations": [\n    {\n      "expectation_type": "expect_column_values_to_be_of_type",\n      "kwargs": {\n        "column": "temperature",\n        "cost": 0,\n        "mostly": 0.8,\n        "type_": "int"\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_values_to_be_increasing",\n      "kwargs": {\n        "column": "uv",\n        "cost": 0,\n        "mostly": 0.8\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_values_to_be_unique",\n      "kwargs": {\n        "column": "rotate",\n        "cost": 0,\n        "mostly": 0.8\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_values_to_be_between",\n      "kwargs": {\n        "column": "volt",\n        "cost": 0,\n        "max_value": 400,\n        "min_value": 100,\n        "mostly": 0.8\n      },\n      "meta": {}\n    }\n  ],\n  "ge_cloud_id": null,\n  "meta": {\n    "great_expectations_version": "0.15.7"\n  }\n}
suite_8	{\n  "data_asset_type": null,\n  "expectation_suite_name": "suite_8",\n  "expectations": [\n    {\n      "expectation_type": "expect_multicolumn_sum_to_equal",\n      "kwargs": {\n        "column": "uv",\n        "column_list": [\n          "uv",\n          "temperature"\n        ],\n        "cost": 0,\n        "mostly": 0.8,\n        "sum_total": "sum_total"\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_values_to_be_increasing",\n      "kwargs": {\n        "column": "humidity",\n        "cost": 0,\n        "mostly": 0.8\n      },\n      "meta": {}\n    }\n  ],\n  "ge_cloud_id": null,\n  "meta": {\n    "great_expectations_version": "0.15.7"\n  }\n}
wefdsfd	{\n  "data_asset_type": null,\n  "expectation_suite_name": "wefdsfd",\n  "expectations": [\n    {\n      "expectation_type": "expect_column_values_to_be_unique",\n      "kwargs": {\n        "column": "pressure",\n        "cost": 0,\n        "mostly": 0.8\n      },\n      "meta": {}\n    }\n  ],\n  "ge_cloud_id": null,\n  "meta": {\n    "great_expectations_version": "0.15.11"\n  }\n}
Suite_100	{\n  "data_asset_type": null,\n  "expectation_suite_name": "Suite_100",\n  "expectations": [\n    {\n      "expectation_type": "expect_column_values_to_not_be_null",\n      "kwargs": {\n        "column": "device_id",\n        "cost": "1000",\n        "mostly": 0.9\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_values_to_be_unique",\n      "kwargs": {\n        "column": "timestamp",\n        "cost": 0,\n        "mostly": 0.8\n      },\n      "meta": {}\n    }\n  ],\n  "ge_cloud_id": null,\n  "meta": {\n    "great_expectations_version": "0.15.11"\n  }\n}
Suite_12	{\n  "data_asset_type": null,\n  "expectation_suite_name": "Suite_12",\n  "expectations": [\n    {\n      "expectation_type": "expect_column_values_to_be_increasing",\n      "kwargs": {\n        "column": "timestamp",\n        "cost": "200",\n        "mostly": 0.8\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_values_to_be_between",\n      "kwargs": {\n        "column": "volt",\n        "cost": "150",\n        "max_value": 100,\n        "min_value": 0,\n        "mostly": 0.8\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_max_to_be_between",\n      "kwargs": {\n        "column": "pressure",\n        "cost": "20",\n        "max_value": 100,\n        "min_value": 0,\n        "mostly": 0.8\n      },\n      "meta": {}\n    }\n  ],\n  "ge_cloud_id": null,\n  "meta": {\n    "great_expectations_version": "0.15.11"\n  }\n}
Suite_14	{\n  "data_asset_type": null,\n  "expectation_suite_name": "Suite_14",\n  "expectations": [\n    {\n      "expectation_type": "expect_column_values_to_be_of_type",\n      "kwargs": {\n        "column": "pressure",\n        "cost": "10",\n        "mostly": 0.8,\n        "type_": "float"\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_values_to_not_be_null",\n      "kwargs": {\n        "column": "device_id",\n        "cost": "20",\n        "mostly": 0.8\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_values_to_be_unique",\n      "kwargs": {\n        "column": "ip_address",\n        "cost": "20",\n        "mostly": 0.8\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_values_to_be_increasing",\n      "kwargs": {\n        "column": "rotate",\n        "cost": "30",\n        "mostly": 0.2\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_values_to_be_between",\n      "kwargs": {\n        "column": "volt",\n        "cost": "20",\n        "max_value": 500,\n        "min_value": 100,\n        "mostly": 0.8\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_min_to_be_between",\n      "kwargs": {\n        "column": "volt",\n        "cost": "30",\n        "max_value": 200,\n        "min_value": 100,\n        "mostly": 0.8\n      },\n      "meta": {}\n    }\n  ],\n  "ge_cloud_id": null,\n  "meta": {\n    "great_expectations_version": "0.15.11"\n  }\n}
Suite_15	{\n  "data_asset_type": null,\n  "expectation_suite_name": "Suite_15",\n  "expectations": [\n    {\n      "expectation_type": "expect_column_values_to_be_of_type",\n      "kwargs": {\n        "column": "device_status",\n        "cost": "20",\n        "mostly": 0.8,\n        "type_": "str"\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_values_to_not_be_null",\n      "kwargs": {\n        "column": "ip_address",\n        "cost": "2",\n        "mostly": 0.8\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_values_to_be_decreasing",\n      "kwargs": {\n        "column": "rotate",\n        "cost": "20",\n        "mostly": 0.8\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_values_to_be_increasing",\n      "kwargs": {\n        "column": "ip_address",\n        "cost": 0,\n        "mostly": 0.2\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_values_to_be_between",\n      "kwargs": {\n        "column": "rotate",\n        "cost": "26",\n        "max_value": 100,\n        "min_value": 0,\n        "mostly": 0.9\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_median_to_be_between",\n      "kwargs": {\n        "column": "rotate",\n        "cost": "30",\n        "max_value": 100,\n        "min_value": 0,\n        "mostly": 0.8\n      },\n      "meta": {}\n    }\n  ],\n  "ge_cloud_id": null,\n  "meta": {\n    "great_expectations_version": "0.15.11"\n  }\n}
Suite_16	{\n  "data_asset_type": null,\n  "expectation_suite_name": "Suite_16",\n  "expectations": [\n    {\n      "expectation_type": "expect_column_values_to_be_increasing",\n      "kwargs": {\n        "column": "timestamp",\n        "cost": 0,\n        "mostly": 0.1\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_values_to_be_between",\n      "kwargs": {\n        "column": "volt",\n        "cost": 0,\n        "max_value": 1000,\n        "min_value": 100,\n        "mostly": 0.8\n      },\n      "meta": {}\n    }\n  ],\n  "ge_cloud_id": null,\n  "meta": {\n    "great_expectations_version": "0.15.11"\n  }\n}
Suite_17	{\n  "data_asset_type": null,\n  "expectation_suite_name": "Suite_17",\n  "expectations": [\n    {\n      "expectation_type": "expect_column_values_to_be_of_type",\n      "kwargs": {\n        "column": "rotate",\n        "cost": "10",\n        "mostly": 0.8,\n        "type_": "float"\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_values_to_be_increasing",\n      "kwargs": {\n        "column": "rotate",\n        "cost": 0,\n        "mostly": 0.2\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_values_to_be_between",\n      "kwargs": {\n        "column": "volt",\n        "cost": "10",\n        "max_value": 1000,\n        "min_value": 100,\n        "mostly": 0.8\n      },\n      "meta": {}\n    }\n  ],\n  "ge_cloud_id": null,\n  "meta": {\n    "great_expectations_version": "0.15.11"\n  }\n}
Suite_18	{\n  "data_asset_type": null,\n  "expectation_suite_name": "Suite_18",\n  "expectations": [\n    {\n      "expectation_type": "expect_column_min_to_be_between",\n      "kwargs": {\n        "column": "volt",\n        "cost": "10",\n        "max_value": 1000,\n        "min_value": 0,\n        "mostly": 0.8\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_values_to_be_increasing",\n      "kwargs": {\n        "column": "rotate",\n        "cost": 0,\n        "mostly": 0.1\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_values_to_be_between",\n      "kwargs": {\n        "column": "volt",\n        "cost": 0,\n        "max_value": 1000,\n        "min_value": 0,\n        "mostly": 0.8\n      },\n      "meta": {}\n    }\n  ],\n  "ge_cloud_id": null,\n  "meta": {\n    "great_expectations_version": "0.15.11"\n  }\n}
Demo_10000	{\n  "data_asset_type": null,\n  "expectation_suite_name": "Demo_10000",\n  "expectations": [\n    {\n      "expectation_type": "expect_column_values_to_not_be_null",\n      "kwargs": {\n        "column": "device_id",\n        "cost": "10",\n        "mostly": 1\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_values_to_be_unique",\n      "kwargs": {\n        "column": "timestamp",\n        "cost": 0,\n        "mostly": 0.8\n      },\n      "meta": {}\n    }\n  ],\n  "ge_cloud_id": null,\n  "meta": {\n    "great_expectations_version": "0.15.11"\n  }\n}
DEmo	{\n  "data_asset_type": null,\n  "expectation_suite_name": "DEmo",\n  "expectations": [\n    {\n      "expectation_type": "expect_column_values_to_be_of_type",\n      "kwargs": {\n        "column": "Name",\n        "cost": 0,\n        "mostly": 0.8,\n        "type_": "type"\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_values_to_be_of_type",\n      "kwargs": {\n        "column": "Address ",\n        "cost": 0,\n        "mostly": 0.8,\n        "type_": "type"\n      },\n      "meta": {}\n    }\n  ],\n  "ge_cloud_id": null,\n  "meta": {\n    "great_expectations_version": "0.15.12"\n  }\n}
DEMO1	{\n  "data_asset_type": null,\n  "expectation_suite_name": "DEMO1",\n  "expectations": [\n    {\n      "expectation_type": "expect_table_columns_to_match_ordered_list",\n      "kwargs": {\n        "column": "timestamp",\n        "column_list": [\n          "column_list"\n        ],\n        "cost": 0,\n        "mostly": 0.8\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_values_to_be_of_type",\n      "kwargs": {\n        "column": "timestamp",\n        "cost": 0,\n        "mostly": 0.8,\n        "type_": "type"\n      },\n      "meta": {}\n    }\n  ],\n  "ge_cloud_id": null,\n  "meta": {\n    "great_expectations_version": "0.15.12"\n  }\n}
sample_suite	{\n  "data_asset_type": null,\n  "expectation_suite_name": "sample_suite",\n  "expectations": [\n    {\n      "expectation_type": "expect_column_values_to_be_of_type",\n      "kwargs": {\n        "column": "Name",\n        "cost": 0,\n        "mostly": 0.8,\n        "type_": "str"\n      },\n      "meta": {}\n    },\n    {\n      "expectation_type": "expect_column_values_to_not_be_null",\n      "kwargs": {\n        "column": "Unit Cost",\n        "cost": 0,\n        "mostly": 0.8\n      },\n      "meta": {}\n    }\n  ],\n  "ge_cloud_id": null,\n  "meta": {\n    "great_expectations_version": "0.15.7"\n  }\n}
\.


--
-- Data for Name: ge_validations_store; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.ge_validations_store (expectation_suite_name, run_name, run_time, batch_identifier, value) FROM stdin;
suite_2	checkpoint_1-20220614-110800	20220614T110800.672844Z	5cc261183f174463f79c5e6acd5915a5	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Customer_OrderData.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "local"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220614T110802.010050Z",\n      "pandas_data_fingerprint": "8c01a7f129832be7e2c611cbc5c25ba0"\n    },\n    "batch_spec": {\n      "path": "ge_core\\\\temp\\\\local\\\\Customer_OrderData.csv"\n    },\n    "expectation_suite_name": "suite_2",\n    "great_expectations_version": "0.15.7",\n    "run_id": {\n      "run_name": "checkpoint_1-20220614-110800",\n      "run_time": "2022-06-14T11:08:00.672844+00:00"\n    },\n    "validation_time": "20220614T110802.062090Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_of_type",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Name",\n          "cost": 0,\n          "mostly": 0.8,\n          "type_": "str"\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_unique",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Email Address",\n          "cost": "10",\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_between",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Unit Cost",\n          "cost": "10",\n          "max_value": 1000000,\n          "min_value": 10000,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 17,\n            "value": 263.33\n          },\n          {\n            "count": 14,\n            "value": 6.92\n          },\n          {\n            "count": 12,\n            "value": 31.79\n          },\n          {\n            "count": 12,\n            "value": 502.54\n          },\n          {\n            "count": 11,\n            "value": 35.84\n          },\n          {\n            "count": 10,\n            "value": 117.11\n          },\n          {\n            "count": 9,\n            "value": 56.67\n          },\n          {\n            "count": 9,\n            "value": 159.42\n          },\n          {\n            "count": 9,\n            "value": 364.69\n          },\n          {\n            "count": 9,\n            "value": 524.96\n          },\n          {\n            "count": 5,\n            "value": 97.44\n          },\n          {\n            "count": 3,\n            "value": 90.93\n          }\n        ],\n        "partial_unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19\n        ],\n        "partial_unexpected_list": [\n          6.92,\n          35.84,\n          364.69,\n          35.84,\n          31.79,\n          6.92,\n          31.79,\n          31.79,\n          524.96,\n          263.33,\n          6.92,\n          263.33,\n          97.44,\n          35.84,\n          56.67,\n          56.67,\n          524.96,\n          263.33,\n          263.33,\n          56.67\n        ],\n        "unexpected_count": 120,\n        "unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19,\n          20,\n          21,\n          22,\n          23,\n          24,\n          25,\n          26,\n          27,\n          28,\n          29,\n          30,\n          31,\n          32,\n          33,\n          34,\n          35,\n          36,\n          37,\n          38,\n          39,\n          40,\n          41,\n          42,\n          43,\n          44,\n          45,\n          46,\n          47,\n          48,\n          49,\n          50,\n          51,\n          52,\n          53,\n          54,\n          55,\n          56,\n          57,\n          58,\n          59,\n          60,\n          61,\n          62,\n          63,\n          64,\n          65,\n          66,\n          67,\n          68,\n          69,\n          70,\n          71,\n          72,\n          73,\n          74,\n          75,\n          76,\n          77,\n          78,\n          79,\n          80,\n          81,\n          82,\n          83,\n          84,\n          85,\n          86,\n          87,\n          88,\n          89,\n          90,\n          91,\n          92,\n          93,\n          94,\n          95,\n          96,\n          97,\n          98,\n          99,\n          100,\n          101,\n          102,\n          103,\n          104,\n          105,\n          106,\n          107,\n          108,\n          109,\n          110,\n          111,\n          112,\n          113,\n          114,\n          115,\n          116,\n          117,\n          118,\n          119\n        ],\n        "unexpected_list": [\n          6.92,\n          35.84,\n          364.69,\n          35.84,\n          31.79,\n          6.92,\n          31.79,\n          31.79,\n          524.96,\n          263.33,\n          6.92,\n          263.33,\n          97.44,\n          35.84,\n          56.67,\n          56.67,\n          524.96,\n          263.33,\n          263.33,\n          56.67,\n          524.96,\n          502.54,\n          90.93,\n          263.33,\n          159.42,\n          524.96,\n          263.33,\n          502.54,\n          524.96,\n          502.54,\n          31.79,\n          6.92,\n          97.44,\n          502.54,\n          97.44,\n          263.33,\n          56.67,\n          502.54,\n          263.33,\n          502.54,\n          35.84,\n          35.84,\n          117.11,\n          31.79,\n          502.54,\n          263.33,\n          35.84,\n          263.33,\n          364.69,\n          6.92,\n          364.69,\n          502.54,\n          524.96,\n          263.33,\n          364.69,\n          364.69,\n          35.84,\n          117.11,\n          31.79,\n          117.11,\n          56.67,\n          6.92,\n          117.11,\n          524.96,\n          6.92,\n          31.79,\n          117.11,\n          31.79,\n          159.42,\n          90.93,\n          6.92,\n          502.54,\n          31.79,\n          56.67,\n          35.84,\n          159.42,\n          6.92,\n          31.79,\n          35.84,\n          117.11,\n          6.92,\n          502.54,\n          56.67,\n          159.42,\n          6.92,\n          159.42,\n          524.96,\n          6.92,\n          6.92,\n          117.11,\n          364.69,\n          35.84,\n          56.67,\n          263.33,\n          31.79,\n          159.42,\n          364.69,\n          364.69,\n          117.11,\n          159.42,\n          263.33,\n          6.92,\n          117.11,\n          159.42,\n          97.44,\n          502.54,\n          263.33,\n          90.93,\n          502.54,\n          159.42,\n          56.67,\n          263.33,\n          31.79,\n          524.96,\n          364.69,\n          35.84,\n          97.44,\n          117.11,\n          263.33,\n          263.33\n        ],\n        "unexpected_percent": 100.0,\n        "unexpected_percent_nonmissing": 100.0,\n        "unexpected_percent_total": 100.0\n      },\n      "success": false\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 3,\n    "success_percent": 66.66666666666666,\n    "successful_expectations": 2,\n    "unsuccessful_expectations": 1\n  },\n  "success": false\n}
suite_2	checkpoint_1-20220616-114856	20220616T114856.209266Z	5cc261183f174463f79c5e6acd5915a5	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Customer_OrderData.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "local"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220616T114857.751984Z",\n      "pandas_data_fingerprint": "8c01a7f129832be7e2c611cbc5c25ba0"\n    },\n    "batch_spec": {\n      "path": "ge_core\\\\temp\\\\local\\\\Customer_OrderData.csv"\n    },\n    "expectation_suite_name": "suite_2",\n    "great_expectations_version": "0.15.7",\n    "run_id": {\n      "run_name": "checkpoint_1-20220616-114856",\n      "run_time": "2022-06-16T11:48:56.209266+00:00"\n    },\n    "validation_time": "20220616T114858.081279Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_of_type",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Name",\n          "cost": 0,\n          "mostly": 0.8,\n          "type_": "str"\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_unique",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Email Address",\n          "cost": "10",\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_between",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Unit Cost",\n          "cost": "10",\n          "max_value": 1000000,\n          "min_value": 10000,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 17,\n            "value": 263.33\n          },\n          {\n            "count": 14,\n            "value": 6.92\n          },\n          {\n            "count": 12,\n            "value": 31.79\n          },\n          {\n            "count": 12,\n            "value": 502.54\n          },\n          {\n            "count": 11,\n            "value": 35.84\n          },\n          {\n            "count": 10,\n            "value": 117.11\n          },\n          {\n            "count": 9,\n            "value": 56.67\n          },\n          {\n            "count": 9,\n            "value": 159.42\n          },\n          {\n            "count": 9,\n            "value": 364.69\n          },\n          {\n            "count": 9,\n            "value": 524.96\n          },\n          {\n            "count": 5,\n            "value": 97.44\n          },\n          {\n            "count": 3,\n            "value": 90.93\n          }\n        ],\n        "partial_unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19\n        ],\n        "partial_unexpected_list": [\n          6.92,\n          35.84,\n          364.69,\n          35.84,\n          31.79,\n          6.92,\n          31.79,\n          31.79,\n          524.96,\n          263.33,\n          6.92,\n          263.33,\n          97.44,\n          35.84,\n          56.67,\n          56.67,\n          524.96,\n          263.33,\n          263.33,\n          56.67\n        ],\n        "unexpected_count": 120,\n        "unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19,\n          20,\n          21,\n          22,\n          23,\n          24,\n          25,\n          26,\n          27,\n          28,\n          29,\n          30,\n          31,\n          32,\n          33,\n          34,\n          35,\n          36,\n          37,\n          38,\n          39,\n          40,\n          41,\n          42,\n          43,\n          44,\n          45,\n          46,\n          47,\n          48,\n          49,\n          50,\n          51,\n          52,\n          53,\n          54,\n          55,\n          56,\n          57,\n          58,\n          59,\n          60,\n          61,\n          62,\n          63,\n          64,\n          65,\n          66,\n          67,\n          68,\n          69,\n          70,\n          71,\n          72,\n          73,\n          74,\n          75,\n          76,\n          77,\n          78,\n          79,\n          80,\n          81,\n          82,\n          83,\n          84,\n          85,\n          86,\n          87,\n          88,\n          89,\n          90,\n          91,\n          92,\n          93,\n          94,\n          95,\n          96,\n          97,\n          98,\n          99,\n          100,\n          101,\n          102,\n          103,\n          104,\n          105,\n          106,\n          107,\n          108,\n          109,\n          110,\n          111,\n          112,\n          113,\n          114,\n          115,\n          116,\n          117,\n          118,\n          119\n        ],\n        "unexpected_list": [\n          6.92,\n          35.84,\n          364.69,\n          35.84,\n          31.79,\n          6.92,\n          31.79,\n          31.79,\n          524.96,\n          263.33,\n          6.92,\n          263.33,\n          97.44,\n          35.84,\n          56.67,\n          56.67,\n          524.96,\n          263.33,\n          263.33,\n          56.67,\n          524.96,\n          502.54,\n          90.93,\n          263.33,\n          159.42,\n          524.96,\n          263.33,\n          502.54,\n          524.96,\n          502.54,\n          31.79,\n          6.92,\n          97.44,\n          502.54,\n          97.44,\n          263.33,\n          56.67,\n          502.54,\n          263.33,\n          502.54,\n          35.84,\n          35.84,\n          117.11,\n          31.79,\n          502.54,\n          263.33,\n          35.84,\n          263.33,\n          364.69,\n          6.92,\n          364.69,\n          502.54,\n          524.96,\n          263.33,\n          364.69,\n          364.69,\n          35.84,\n          117.11,\n          31.79,\n          117.11,\n          56.67,\n          6.92,\n          117.11,\n          524.96,\n          6.92,\n          31.79,\n          117.11,\n          31.79,\n          159.42,\n          90.93,\n          6.92,\n          502.54,\n          31.79,\n          56.67,\n          35.84,\n          159.42,\n          6.92,\n          31.79,\n          35.84,\n          117.11,\n          6.92,\n          502.54,\n          56.67,\n          159.42,\n          6.92,\n          159.42,\n          524.96,\n          6.92,\n          6.92,\n          117.11,\n          364.69,\n          35.84,\n          56.67,\n          263.33,\n          31.79,\n          159.42,\n          364.69,\n          364.69,\n          117.11,\n          159.42,\n          263.33,\n          6.92,\n          117.11,\n          159.42,\n          97.44,\n          502.54,\n          263.33,\n          90.93,\n          502.54,\n          159.42,\n          56.67,\n          263.33,\n          31.79,\n          524.96,\n          364.69,\n          35.84,\n          97.44,\n          117.11,\n          263.33,\n          263.33\n        ],\n        "unexpected_percent": 100.0,\n        "unexpected_percent_nonmissing": 100.0,\n        "unexpected_percent_total": 100.0\n      },\n      "success": false\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 3,\n    "success_percent": 66.66666666666666,\n    "successful_expectations": 2,\n    "unsuccessful_expectations": 1\n  },\n  "success": false\n}
suite_2	checkpoint_1-20220616-114920	20220616T114920.755043Z	5cc261183f174463f79c5e6acd5915a5	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Customer_OrderData.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "local"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220616T114922.086726Z",\n      "pandas_data_fingerprint": "8c01a7f129832be7e2c611cbc5c25ba0"\n    },\n    "batch_spec": {\n      "path": "ge_core\\\\temp\\\\local\\\\Customer_OrderData.csv"\n    },\n    "expectation_suite_name": "suite_2",\n    "great_expectations_version": "0.15.7",\n    "run_id": {\n      "run_name": "checkpoint_1-20220616-114920",\n      "run_time": "2022-06-16T11:49:20.755043+00:00"\n    },\n    "validation_time": "20220616T114922.151236Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_of_type",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Name",\n          "cost": 0,\n          "mostly": 0.8,\n          "type_": "str"\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_unique",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Email Address",\n          "cost": "10",\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_between",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Unit Cost",\n          "cost": "10",\n          "max_value": 1000000,\n          "min_value": 10000,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 17,\n            "value": 263.33\n          },\n          {\n            "count": 14,\n            "value": 6.92\n          },\n          {\n            "count": 12,\n            "value": 31.79\n          },\n          {\n            "count": 12,\n            "value": 502.54\n          },\n          {\n            "count": 11,\n            "value": 35.84\n          },\n          {\n            "count": 10,\n            "value": 117.11\n          },\n          {\n            "count": 9,\n            "value": 56.67\n          },\n          {\n            "count": 9,\n            "value": 159.42\n          },\n          {\n            "count": 9,\n            "value": 364.69\n          },\n          {\n            "count": 9,\n            "value": 524.96\n          },\n          {\n            "count": 5,\n            "value": 97.44\n          },\n          {\n            "count": 3,\n            "value": 90.93\n          }\n        ],\n        "partial_unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19\n        ],\n        "partial_unexpected_list": [\n          6.92,\n          35.84,\n          364.69,\n          35.84,\n          31.79,\n          6.92,\n          31.79,\n          31.79,\n          524.96,\n          263.33,\n          6.92,\n          263.33,\n          97.44,\n          35.84,\n          56.67,\n          56.67,\n          524.96,\n          263.33,\n          263.33,\n          56.67\n        ],\n        "unexpected_count": 120,\n        "unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19,\n          20,\n          21,\n          22,\n          23,\n          24,\n          25,\n          26,\n          27,\n          28,\n          29,\n          30,\n          31,\n          32,\n          33,\n          34,\n          35,\n          36,\n          37,\n          38,\n          39,\n          40,\n          41,\n          42,\n          43,\n          44,\n          45,\n          46,\n          47,\n          48,\n          49,\n          50,\n          51,\n          52,\n          53,\n          54,\n          55,\n          56,\n          57,\n          58,\n          59,\n          60,\n          61,\n          62,\n          63,\n          64,\n          65,\n          66,\n          67,\n          68,\n          69,\n          70,\n          71,\n          72,\n          73,\n          74,\n          75,\n          76,\n          77,\n          78,\n          79,\n          80,\n          81,\n          82,\n          83,\n          84,\n          85,\n          86,\n          87,\n          88,\n          89,\n          90,\n          91,\n          92,\n          93,\n          94,\n          95,\n          96,\n          97,\n          98,\n          99,\n          100,\n          101,\n          102,\n          103,\n          104,\n          105,\n          106,\n          107,\n          108,\n          109,\n          110,\n          111,\n          112,\n          113,\n          114,\n          115,\n          116,\n          117,\n          118,\n          119\n        ],\n        "unexpected_list": [\n          6.92,\n          35.84,\n          364.69,\n          35.84,\n          31.79,\n          6.92,\n          31.79,\n          31.79,\n          524.96,\n          263.33,\n          6.92,\n          263.33,\n          97.44,\n          35.84,\n          56.67,\n          56.67,\n          524.96,\n          263.33,\n          263.33,\n          56.67,\n          524.96,\n          502.54,\n          90.93,\n          263.33,\n          159.42,\n          524.96,\n          263.33,\n          502.54,\n          524.96,\n          502.54,\n          31.79,\n          6.92,\n          97.44,\n          502.54,\n          97.44,\n          263.33,\n          56.67,\n          502.54,\n          263.33,\n          502.54,\n          35.84,\n          35.84,\n          117.11,\n          31.79,\n          502.54,\n          263.33,\n          35.84,\n          263.33,\n          364.69,\n          6.92,\n          364.69,\n          502.54,\n          524.96,\n          263.33,\n          364.69,\n          364.69,\n          35.84,\n          117.11,\n          31.79,\n          117.11,\n          56.67,\n          6.92,\n          117.11,\n          524.96,\n          6.92,\n          31.79,\n          117.11,\n          31.79,\n          159.42,\n          90.93,\n          6.92,\n          502.54,\n          31.79,\n          56.67,\n          35.84,\n          159.42,\n          6.92,\n          31.79,\n          35.84,\n          117.11,\n          6.92,\n          502.54,\n          56.67,\n          159.42,\n          6.92,\n          159.42,\n          524.96,\n          6.92,\n          6.92,\n          117.11,\n          364.69,\n          35.84,\n          56.67,\n          263.33,\n          31.79,\n          159.42,\n          364.69,\n          364.69,\n          117.11,\n          159.42,\n          263.33,\n          6.92,\n          117.11,\n          159.42,\n          97.44,\n          502.54,\n          263.33,\n          90.93,\n          502.54,\n          159.42,\n          56.67,\n          263.33,\n          31.79,\n          524.96,\n          364.69,\n          35.84,\n          97.44,\n          117.11,\n          263.33,\n          263.33\n        ],\n        "unexpected_percent": 100.0,\n        "unexpected_percent_nonmissing": 100.0,\n        "unexpected_percent_total": 100.0\n      },\n      "success": false\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 3,\n    "success_percent": 66.66666666666666,\n    "successful_expectations": 2,\n    "unsuccessful_expectations": 1\n  },\n  "success": false\n}
suite_2	checkpoint_1-20220616-114944	20220616T114944.582233Z	5cc261183f174463f79c5e6acd5915a5	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Customer_OrderData.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "local"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220616T114945.914807Z",\n      "pandas_data_fingerprint": "8c01a7f129832be7e2c611cbc5c25ba0"\n    },\n    "batch_spec": {\n      "path": "ge_core\\\\temp\\\\local\\\\Customer_OrderData.csv"\n    },\n    "expectation_suite_name": "suite_2",\n    "great_expectations_version": "0.15.7",\n    "run_id": {\n      "run_name": "checkpoint_1-20220616-114944",\n      "run_time": "2022-06-16T11:49:44.582233+00:00"\n    },\n    "validation_time": "20220616T114945.979316Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_of_type",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Name",\n          "cost": 0,\n          "mostly": 0.8,\n          "type_": "str"\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_unique",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Email Address",\n          "cost": "10",\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_between",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Unit Cost",\n          "cost": "10",\n          "max_value": 1000000,\n          "min_value": 10000,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 17,\n            "value": 263.33\n          },\n          {\n            "count": 14,\n            "value": 6.92\n          },\n          {\n            "count": 12,\n            "value": 31.79\n          },\n          {\n            "count": 12,\n            "value": 502.54\n          },\n          {\n            "count": 11,\n            "value": 35.84\n          },\n          {\n            "count": 10,\n            "value": 117.11\n          },\n          {\n            "count": 9,\n            "value": 56.67\n          },\n          {\n            "count": 9,\n            "value": 159.42\n          },\n          {\n            "count": 9,\n            "value": 364.69\n          },\n          {\n            "count": 9,\n            "value": 524.96\n          },\n          {\n            "count": 5,\n            "value": 97.44\n          },\n          {\n            "count": 3,\n            "value": 90.93\n          }\n        ],\n        "partial_unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19\n        ],\n        "partial_unexpected_list": [\n          6.92,\n          35.84,\n          364.69,\n          35.84,\n          31.79,\n          6.92,\n          31.79,\n          31.79,\n          524.96,\n          263.33,\n          6.92,\n          263.33,\n          97.44,\n          35.84,\n          56.67,\n          56.67,\n          524.96,\n          263.33,\n          263.33,\n          56.67\n        ],\n        "unexpected_count": 120,\n        "unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19,\n          20,\n          21,\n          22,\n          23,\n          24,\n          25,\n          26,\n          27,\n          28,\n          29,\n          30,\n          31,\n          32,\n          33,\n          34,\n          35,\n          36,\n          37,\n          38,\n          39,\n          40,\n          41,\n          42,\n          43,\n          44,\n          45,\n          46,\n          47,\n          48,\n          49,\n          50,\n          51,\n          52,\n          53,\n          54,\n          55,\n          56,\n          57,\n          58,\n          59,\n          60,\n          61,\n          62,\n          63,\n          64,\n          65,\n          66,\n          67,\n          68,\n          69,\n          70,\n          71,\n          72,\n          73,\n          74,\n          75,\n          76,\n          77,\n          78,\n          79,\n          80,\n          81,\n          82,\n          83,\n          84,\n          85,\n          86,\n          87,\n          88,\n          89,\n          90,\n          91,\n          92,\n          93,\n          94,\n          95,\n          96,\n          97,\n          98,\n          99,\n          100,\n          101,\n          102,\n          103,\n          104,\n          105,\n          106,\n          107,\n          108,\n          109,\n          110,\n          111,\n          112,\n          113,\n          114,\n          115,\n          116,\n          117,\n          118,\n          119\n        ],\n        "unexpected_list": [\n          6.92,\n          35.84,\n          364.69,\n          35.84,\n          31.79,\n          6.92,\n          31.79,\n          31.79,\n          524.96,\n          263.33,\n          6.92,\n          263.33,\n          97.44,\n          35.84,\n          56.67,\n          56.67,\n          524.96,\n          263.33,\n          263.33,\n          56.67,\n          524.96,\n          502.54,\n          90.93,\n          263.33,\n          159.42,\n          524.96,\n          263.33,\n          502.54,\n          524.96,\n          502.54,\n          31.79,\n          6.92,\n          97.44,\n          502.54,\n          97.44,\n          263.33,\n          56.67,\n          502.54,\n          263.33,\n          502.54,\n          35.84,\n          35.84,\n          117.11,\n          31.79,\n          502.54,\n          263.33,\n          35.84,\n          263.33,\n          364.69,\n          6.92,\n          364.69,\n          502.54,\n          524.96,\n          263.33,\n          364.69,\n          364.69,\n          35.84,\n          117.11,\n          31.79,\n          117.11,\n          56.67,\n          6.92,\n          117.11,\n          524.96,\n          6.92,\n          31.79,\n          117.11,\n          31.79,\n          159.42,\n          90.93,\n          6.92,\n          502.54,\n          31.79,\n          56.67,\n          35.84,\n          159.42,\n          6.92,\n          31.79,\n          35.84,\n          117.11,\n          6.92,\n          502.54,\n          56.67,\n          159.42,\n          6.92,\n          159.42,\n          524.96,\n          6.92,\n          6.92,\n          117.11,\n          364.69,\n          35.84,\n          56.67,\n          263.33,\n          31.79,\n          159.42,\n          364.69,\n          364.69,\n          117.11,\n          159.42,\n          263.33,\n          6.92,\n          117.11,\n          159.42,\n          97.44,\n          502.54,\n          263.33,\n          90.93,\n          502.54,\n          159.42,\n          56.67,\n          263.33,\n          31.79,\n          524.96,\n          364.69,\n          35.84,\n          97.44,\n          117.11,\n          263.33,\n          263.33\n        ],\n        "unexpected_percent": 100.0,\n        "unexpected_percent_nonmissing": 100.0,\n        "unexpected_percent_total": 100.0\n      },\n      "success": false\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 3,\n    "success_percent": 66.66666666666666,\n    "successful_expectations": 2,\n    "unsuccessful_expectations": 1\n  },\n  "success": false\n}
suite_2	checkpoint_2-20220616-115132	20220616T115132.711431Z	4b713199ec1ff5ba9040f5c796cb20d3	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Customer_OrderData.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "local2"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220616T115134.042367Z",\n      "pandas_data_fingerprint": "8c01a7f129832be7e2c611cbc5c25ba0"\n    },\n    "batch_spec": {\n      "path": "ge_core\\\\temp\\\\local2\\\\Customer_OrderData.csv"\n    },\n    "expectation_suite_name": "suite_2",\n    "great_expectations_version": "0.15.7",\n    "run_id": {\n      "run_name": "checkpoint_2-20220616-115132",\n      "run_time": "2022-06-16T11:51:32.711431+00:00"\n    },\n    "validation_time": "20220616T115134.116383Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_of_type",\n        "kwargs": {\n          "batch_id": "4b713199ec1ff5ba9040f5c796cb20d3",\n          "column": "Name",\n          "cost": 0,\n          "mostly": 0.8,\n          "type_": "str"\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_unique",\n        "kwargs": {\n          "batch_id": "4b713199ec1ff5ba9040f5c796cb20d3",\n          "column": "Email Address",\n          "cost": "10",\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_between",\n        "kwargs": {\n          "batch_id": "4b713199ec1ff5ba9040f5c796cb20d3",\n          "column": "Unit Cost",\n          "cost": "10",\n          "max_value": 1000000,\n          "min_value": 10000,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 17,\n            "value": 263.33\n          },\n          {\n            "count": 14,\n            "value": 6.92\n          },\n          {\n            "count": 12,\n            "value": 31.79\n          },\n          {\n            "count": 12,\n            "value": 502.54\n          },\n          {\n            "count": 11,\n            "value": 35.84\n          },\n          {\n            "count": 10,\n            "value": 117.11\n          },\n          {\n            "count": 9,\n            "value": 56.67\n          },\n          {\n            "count": 9,\n            "value": 159.42\n          },\n          {\n            "count": 9,\n            "value": 364.69\n          },\n          {\n            "count": 9,\n            "value": 524.96\n          },\n          {\n            "count": 5,\n            "value": 97.44\n          },\n          {\n            "count": 3,\n            "value": 90.93\n          }\n        ],\n        "partial_unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19\n        ],\n        "partial_unexpected_list": [\n          6.92,\n          35.84,\n          364.69,\n          35.84,\n          31.79,\n          6.92,\n          31.79,\n          31.79,\n          524.96,\n          263.33,\n          6.92,\n          263.33,\n          97.44,\n          35.84,\n          56.67,\n          56.67,\n          524.96,\n          263.33,\n          263.33,\n          56.67\n        ],\n        "unexpected_count": 120,\n        "unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19,\n          20,\n          21,\n          22,\n          23,\n          24,\n          25,\n          26,\n          27,\n          28,\n          29,\n          30,\n          31,\n          32,\n          33,\n          34,\n          35,\n          36,\n          37,\n          38,\n          39,\n          40,\n          41,\n          42,\n          43,\n          44,\n          45,\n          46,\n          47,\n          48,\n          49,\n          50,\n          51,\n          52,\n          53,\n          54,\n          55,\n          56,\n          57,\n          58,\n          59,\n          60,\n          61,\n          62,\n          63,\n          64,\n          65,\n          66,\n          67,\n          68,\n          69,\n          70,\n          71,\n          72,\n          73,\n          74,\n          75,\n          76,\n          77,\n          78,\n          79,\n          80,\n          81,\n          82,\n          83,\n          84,\n          85,\n          86,\n          87,\n          88,\n          89,\n          90,\n          91,\n          92,\n          93,\n          94,\n          95,\n          96,\n          97,\n          98,\n          99,\n          100,\n          101,\n          102,\n          103,\n          104,\n          105,\n          106,\n          107,\n          108,\n          109,\n          110,\n          111,\n          112,\n          113,\n          114,\n          115,\n          116,\n          117,\n          118,\n          119\n        ],\n        "unexpected_list": [\n          6.92,\n          35.84,\n          364.69,\n          35.84,\n          31.79,\n          6.92,\n          31.79,\n          31.79,\n          524.96,\n          263.33,\n          6.92,\n          263.33,\n          97.44,\n          35.84,\n          56.67,\n          56.67,\n          524.96,\n          263.33,\n          263.33,\n          56.67,\n          524.96,\n          502.54,\n          90.93,\n          263.33,\n          159.42,\n          524.96,\n          263.33,\n          502.54,\n          524.96,\n          502.54,\n          31.79,\n          6.92,\n          97.44,\n          502.54,\n          97.44,\n          263.33,\n          56.67,\n          502.54,\n          263.33,\n          502.54,\n          35.84,\n          35.84,\n          117.11,\n          31.79,\n          502.54,\n          263.33,\n          35.84,\n          263.33,\n          364.69,\n          6.92,\n          364.69,\n          502.54,\n          524.96,\n          263.33,\n          364.69,\n          364.69,\n          35.84,\n          117.11,\n          31.79,\n          117.11,\n          56.67,\n          6.92,\n          117.11,\n          524.96,\n          6.92,\n          31.79,\n          117.11,\n          31.79,\n          159.42,\n          90.93,\n          6.92,\n          502.54,\n          31.79,\n          56.67,\n          35.84,\n          159.42,\n          6.92,\n          31.79,\n          35.84,\n          117.11,\n          6.92,\n          502.54,\n          56.67,\n          159.42,\n          6.92,\n          159.42,\n          524.96,\n          6.92,\n          6.92,\n          117.11,\n          364.69,\n          35.84,\n          56.67,\n          263.33,\n          31.79,\n          159.42,\n          364.69,\n          364.69,\n          117.11,\n          159.42,\n          263.33,\n          6.92,\n          117.11,\n          159.42,\n          97.44,\n          502.54,\n          263.33,\n          90.93,\n          502.54,\n          159.42,\n          56.67,\n          263.33,\n          31.79,\n          524.96,\n          364.69,\n          35.84,\n          97.44,\n          117.11,\n          263.33,\n          263.33\n        ],\n        "unexpected_percent": 100.0,\n        "unexpected_percent_nonmissing": 100.0,\n        "unexpected_percent_total": 100.0\n      },\n      "success": false\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 3,\n    "success_percent": 66.66666666666666,\n    "successful_expectations": 2,\n    "unsuccessful_expectations": 1\n  },\n  "success": false\n}
suite_2	checkpoint_2-20220616-115154	20220616T115154.806669Z	4b713199ec1ff5ba9040f5c796cb20d3	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Customer_OrderData.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "local2"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220616T115156.137530Z",\n      "pandas_data_fingerprint": "8c01a7f129832be7e2c611cbc5c25ba0"\n    },\n    "batch_spec": {\n      "path": "ge_core\\\\temp\\\\local2\\\\Customer_OrderData.csv"\n    },\n    "expectation_suite_name": "suite_2",\n    "great_expectations_version": "0.15.7",\n    "run_id": {\n      "run_name": "checkpoint_2-20220616-115154",\n      "run_time": "2022-06-16T11:51:54.806669+00:00"\n    },\n    "validation_time": "20220616T115156.204038Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_of_type",\n        "kwargs": {\n          "batch_id": "4b713199ec1ff5ba9040f5c796cb20d3",\n          "column": "Name",\n          "cost": 0,\n          "mostly": 0.8,\n          "type_": "str"\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_unique",\n        "kwargs": {\n          "batch_id": "4b713199ec1ff5ba9040f5c796cb20d3",\n          "column": "Email Address",\n          "cost": "10",\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_between",\n        "kwargs": {\n          "batch_id": "4b713199ec1ff5ba9040f5c796cb20d3",\n          "column": "Unit Cost",\n          "cost": "10",\n          "max_value": 1000000,\n          "min_value": 10000,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 17,\n            "value": 263.33\n          },\n          {\n            "count": 14,\n            "value": 6.92\n          },\n          {\n            "count": 12,\n            "value": 31.79\n          },\n          {\n            "count": 12,\n            "value": 502.54\n          },\n          {\n            "count": 11,\n            "value": 35.84\n          },\n          {\n            "count": 10,\n            "value": 117.11\n          },\n          {\n            "count": 9,\n            "value": 56.67\n          },\n          {\n            "count": 9,\n            "value": 159.42\n          },\n          {\n            "count": 9,\n            "value": 364.69\n          },\n          {\n            "count": 9,\n            "value": 524.96\n          },\n          {\n            "count": 5,\n            "value": 97.44\n          },\n          {\n            "count": 3,\n            "value": 90.93\n          }\n        ],\n        "partial_unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19\n        ],\n        "partial_unexpected_list": [\n          6.92,\n          35.84,\n          364.69,\n          35.84,\n          31.79,\n          6.92,\n          31.79,\n          31.79,\n          524.96,\n          263.33,\n          6.92,\n          263.33,\n          97.44,\n          35.84,\n          56.67,\n          56.67,\n          524.96,\n          263.33,\n          263.33,\n          56.67\n        ],\n        "unexpected_count": 120,\n        "unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19,\n          20,\n          21,\n          22,\n          23,\n          24,\n          25,\n          26,\n          27,\n          28,\n          29,\n          30,\n          31,\n          32,\n          33,\n          34,\n          35,\n          36,\n          37,\n          38,\n          39,\n          40,\n          41,\n          42,\n          43,\n          44,\n          45,\n          46,\n          47,\n          48,\n          49,\n          50,\n          51,\n          52,\n          53,\n          54,\n          55,\n          56,\n          57,\n          58,\n          59,\n          60,\n          61,\n          62,\n          63,\n          64,\n          65,\n          66,\n          67,\n          68,\n          69,\n          70,\n          71,\n          72,\n          73,\n          74,\n          75,\n          76,\n          77,\n          78,\n          79,\n          80,\n          81,\n          82,\n          83,\n          84,\n          85,\n          86,\n          87,\n          88,\n          89,\n          90,\n          91,\n          92,\n          93,\n          94,\n          95,\n          96,\n          97,\n          98,\n          99,\n          100,\n          101,\n          102,\n          103,\n          104,\n          105,\n          106,\n          107,\n          108,\n          109,\n          110,\n          111,\n          112,\n          113,\n          114,\n          115,\n          116,\n          117,\n          118,\n          119\n        ],\n        "unexpected_list": [\n          6.92,\n          35.84,\n          364.69,\n          35.84,\n          31.79,\n          6.92,\n          31.79,\n          31.79,\n          524.96,\n          263.33,\n          6.92,\n          263.33,\n          97.44,\n          35.84,\n          56.67,\n          56.67,\n          524.96,\n          263.33,\n          263.33,\n          56.67,\n          524.96,\n          502.54,\n          90.93,\n          263.33,\n          159.42,\n          524.96,\n          263.33,\n          502.54,\n          524.96,\n          502.54,\n          31.79,\n          6.92,\n          97.44,\n          502.54,\n          97.44,\n          263.33,\n          56.67,\n          502.54,\n          263.33,\n          502.54,\n          35.84,\n          35.84,\n          117.11,\n          31.79,\n          502.54,\n          263.33,\n          35.84,\n          263.33,\n          364.69,\n          6.92,\n          364.69,\n          502.54,\n          524.96,\n          263.33,\n          364.69,\n          364.69,\n          35.84,\n          117.11,\n          31.79,\n          117.11,\n          56.67,\n          6.92,\n          117.11,\n          524.96,\n          6.92,\n          31.79,\n          117.11,\n          31.79,\n          159.42,\n          90.93,\n          6.92,\n          502.54,\n          31.79,\n          56.67,\n          35.84,\n          159.42,\n          6.92,\n          31.79,\n          35.84,\n          117.11,\n          6.92,\n          502.54,\n          56.67,\n          159.42,\n          6.92,\n          159.42,\n          524.96,\n          6.92,\n          6.92,\n          117.11,\n          364.69,\n          35.84,\n          56.67,\n          263.33,\n          31.79,\n          159.42,\n          364.69,\n          364.69,\n          117.11,\n          159.42,\n          263.33,\n          6.92,\n          117.11,\n          159.42,\n          97.44,\n          502.54,\n          263.33,\n          90.93,\n          502.54,\n          159.42,\n          56.67,\n          263.33,\n          31.79,\n          524.96,\n          364.69,\n          35.84,\n          97.44,\n          117.11,\n          263.33,\n          263.33\n        ],\n        "unexpected_percent": 100.0,\n        "unexpected_percent_nonmissing": 100.0,\n        "unexpected_percent_total": 100.0\n      },\n      "success": false\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 3,\n    "success_percent": 66.66666666666666,\n    "successful_expectations": 2,\n    "unsuccessful_expectations": 1\n  },\n  "success": false\n}
suite_2	checkpoint_1-20220616-115256	20220616T115256.387957Z	5cc261183f174463f79c5e6acd5915a5	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Customer_OrderData.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "local"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220616T115257.719118Z",\n      "pandas_data_fingerprint": "8c01a7f129832be7e2c611cbc5c25ba0"\n    },\n    "batch_spec": {\n      "path": "ge_core\\\\temp\\\\local\\\\Customer_OrderData.csv"\n    },\n    "expectation_suite_name": "suite_2",\n    "great_expectations_version": "0.15.7",\n    "run_id": {\n      "run_name": "checkpoint_1-20220616-115256",\n      "run_time": "2022-06-16T11:52:56.387957+00:00"\n    },\n    "validation_time": "20220616T115257.783636Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_of_type",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Name",\n          "cost": 0,\n          "mostly": 0.8,\n          "type_": "str"\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_unique",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Email Address",\n          "cost": "10",\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_between",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Unit Cost",\n          "cost": "10",\n          "max_value": 1000000,\n          "min_value": 10000,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 17,\n            "value": 263.33\n          },\n          {\n            "count": 14,\n            "value": 6.92\n          },\n          {\n            "count": 12,\n            "value": 31.79\n          },\n          {\n            "count": 12,\n            "value": 502.54\n          },\n          {\n            "count": 11,\n            "value": 35.84\n          },\n          {\n            "count": 10,\n            "value": 117.11\n          },\n          {\n            "count": 9,\n            "value": 56.67\n          },\n          {\n            "count": 9,\n            "value": 159.42\n          },\n          {\n            "count": 9,\n            "value": 364.69\n          },\n          {\n            "count": 9,\n            "value": 524.96\n          },\n          {\n            "count": 5,\n            "value": 97.44\n          },\n          {\n            "count": 3,\n            "value": 90.93\n          }\n        ],\n        "partial_unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19\n        ],\n        "partial_unexpected_list": [\n          6.92,\n          35.84,\n          364.69,\n          35.84,\n          31.79,\n          6.92,\n          31.79,\n          31.79,\n          524.96,\n          263.33,\n          6.92,\n          263.33,\n          97.44,\n          35.84,\n          56.67,\n          56.67,\n          524.96,\n          263.33,\n          263.33,\n          56.67\n        ],\n        "unexpected_count": 120,\n        "unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19,\n          20,\n          21,\n          22,\n          23,\n          24,\n          25,\n          26,\n          27,\n          28,\n          29,\n          30,\n          31,\n          32,\n          33,\n          34,\n          35,\n          36,\n          37,\n          38,\n          39,\n          40,\n          41,\n          42,\n          43,\n          44,\n          45,\n          46,\n          47,\n          48,\n          49,\n          50,\n          51,\n          52,\n          53,\n          54,\n          55,\n          56,\n          57,\n          58,\n          59,\n          60,\n          61,\n          62,\n          63,\n          64,\n          65,\n          66,\n          67,\n          68,\n          69,\n          70,\n          71,\n          72,\n          73,\n          74,\n          75,\n          76,\n          77,\n          78,\n          79,\n          80,\n          81,\n          82,\n          83,\n          84,\n          85,\n          86,\n          87,\n          88,\n          89,\n          90,\n          91,\n          92,\n          93,\n          94,\n          95,\n          96,\n          97,\n          98,\n          99,\n          100,\n          101,\n          102,\n          103,\n          104,\n          105,\n          106,\n          107,\n          108,\n          109,\n          110,\n          111,\n          112,\n          113,\n          114,\n          115,\n          116,\n          117,\n          118,\n          119\n        ],\n        "unexpected_list": [\n          6.92,\n          35.84,\n          364.69,\n          35.84,\n          31.79,\n          6.92,\n          31.79,\n          31.79,\n          524.96,\n          263.33,\n          6.92,\n          263.33,\n          97.44,\n          35.84,\n          56.67,\n          56.67,\n          524.96,\n          263.33,\n          263.33,\n          56.67,\n          524.96,\n          502.54,\n          90.93,\n          263.33,\n          159.42,\n          524.96,\n          263.33,\n          502.54,\n          524.96,\n          502.54,\n          31.79,\n          6.92,\n          97.44,\n          502.54,\n          97.44,\n          263.33,\n          56.67,\n          502.54,\n          263.33,\n          502.54,\n          35.84,\n          35.84,\n          117.11,\n          31.79,\n          502.54,\n          263.33,\n          35.84,\n          263.33,\n          364.69,\n          6.92,\n          364.69,\n          502.54,\n          524.96,\n          263.33,\n          364.69,\n          364.69,\n          35.84,\n          117.11,\n          31.79,\n          117.11,\n          56.67,\n          6.92,\n          117.11,\n          524.96,\n          6.92,\n          31.79,\n          117.11,\n          31.79,\n          159.42,\n          90.93,\n          6.92,\n          502.54,\n          31.79,\n          56.67,\n          35.84,\n          159.42,\n          6.92,\n          31.79,\n          35.84,\n          117.11,\n          6.92,\n          502.54,\n          56.67,\n          159.42,\n          6.92,\n          159.42,\n          524.96,\n          6.92,\n          6.92,\n          117.11,\n          364.69,\n          35.84,\n          56.67,\n          263.33,\n          31.79,\n          159.42,\n          364.69,\n          364.69,\n          117.11,\n          159.42,\n          263.33,\n          6.92,\n          117.11,\n          159.42,\n          97.44,\n          502.54,\n          263.33,\n          90.93,\n          502.54,\n          159.42,\n          56.67,\n          263.33,\n          31.79,\n          524.96,\n          364.69,\n          35.84,\n          97.44,\n          117.11,\n          263.33,\n          263.33\n        ],\n        "unexpected_percent": 100.0,\n        "unexpected_percent_nonmissing": 100.0,\n        "unexpected_percent_total": 100.0\n      },\n      "success": false\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 3,\n    "success_percent": 66.66666666666666,\n    "successful_expectations": 2,\n    "unsuccessful_expectations": 1\n  },\n  "success": false\n}
suite_2	checkpoint_1-20220616-115323	20220616T115323.402036Z	5cc261183f174463f79c5e6acd5915a5	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Customer_OrderData.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "local"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220616T115324.734953Z",\n      "pandas_data_fingerprint": "8c01a7f129832be7e2c611cbc5c25ba0"\n    },\n    "batch_spec": {\n      "path": "ge_core\\\\temp\\\\local\\\\Customer_OrderData.csv"\n    },\n    "expectation_suite_name": "suite_2",\n    "great_expectations_version": "0.15.7",\n    "run_id": {\n      "run_name": "checkpoint_1-20220616-115323",\n      "run_time": "2022-06-16T11:53:23.402036+00:00"\n    },\n    "validation_time": "20220616T115324.800466Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_of_type",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Name",\n          "cost": 0,\n          "mostly": 0.8,\n          "type_": "str"\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_unique",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Email Address",\n          "cost": "10",\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_between",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Unit Cost",\n          "cost": "10",\n          "max_value": 1000000,\n          "min_value": 10000,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 17,\n            "value": 263.33\n          },\n          {\n            "count": 14,\n            "value": 6.92\n          },\n          {\n            "count": 12,\n            "value": 31.79\n          },\n          {\n            "count": 12,\n            "value": 502.54\n          },\n          {\n            "count": 11,\n            "value": 35.84\n          },\n          {\n            "count": 10,\n            "value": 117.11\n          },\n          {\n            "count": 9,\n            "value": 56.67\n          },\n          {\n            "count": 9,\n            "value": 159.42\n          },\n          {\n            "count": 9,\n            "value": 364.69\n          },\n          {\n            "count": 9,\n            "value": 524.96\n          },\n          {\n            "count": 5,\n            "value": 97.44\n          },\n          {\n            "count": 3,\n            "value": 90.93\n          }\n        ],\n        "partial_unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19\n        ],\n        "partial_unexpected_list": [\n          6.92,\n          35.84,\n          364.69,\n          35.84,\n          31.79,\n          6.92,\n          31.79,\n          31.79,\n          524.96,\n          263.33,\n          6.92,\n          263.33,\n          97.44,\n          35.84,\n          56.67,\n          56.67,\n          524.96,\n          263.33,\n          263.33,\n          56.67\n        ],\n        "unexpected_count": 120,\n        "unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19,\n          20,\n          21,\n          22,\n          23,\n          24,\n          25,\n          26,\n          27,\n          28,\n          29,\n          30,\n          31,\n          32,\n          33,\n          34,\n          35,\n          36,\n          37,\n          38,\n          39,\n          40,\n          41,\n          42,\n          43,\n          44,\n          45,\n          46,\n          47,\n          48,\n          49,\n          50,\n          51,\n          52,\n          53,\n          54,\n          55,\n          56,\n          57,\n          58,\n          59,\n          60,\n          61,\n          62,\n          63,\n          64,\n          65,\n          66,\n          67,\n          68,\n          69,\n          70,\n          71,\n          72,\n          73,\n          74,\n          75,\n          76,\n          77,\n          78,\n          79,\n          80,\n          81,\n          82,\n          83,\n          84,\n          85,\n          86,\n          87,\n          88,\n          89,\n          90,\n          91,\n          92,\n          93,\n          94,\n          95,\n          96,\n          97,\n          98,\n          99,\n          100,\n          101,\n          102,\n          103,\n          104,\n          105,\n          106,\n          107,\n          108,\n          109,\n          110,\n          111,\n          112,\n          113,\n          114,\n          115,\n          116,\n          117,\n          118,\n          119\n        ],\n        "unexpected_list": [\n          6.92,\n          35.84,\n          364.69,\n          35.84,\n          31.79,\n          6.92,\n          31.79,\n          31.79,\n          524.96,\n          263.33,\n          6.92,\n          263.33,\n          97.44,\n          35.84,\n          56.67,\n          56.67,\n          524.96,\n          263.33,\n          263.33,\n          56.67,\n          524.96,\n          502.54,\n          90.93,\n          263.33,\n          159.42,\n          524.96,\n          263.33,\n          502.54,\n          524.96,\n          502.54,\n          31.79,\n          6.92,\n          97.44,\n          502.54,\n          97.44,\n          263.33,\n          56.67,\n          502.54,\n          263.33,\n          502.54,\n          35.84,\n          35.84,\n          117.11,\n          31.79,\n          502.54,\n          263.33,\n          35.84,\n          263.33,\n          364.69,\n          6.92,\n          364.69,\n          502.54,\n          524.96,\n          263.33,\n          364.69,\n          364.69,\n          35.84,\n          117.11,\n          31.79,\n          117.11,\n          56.67,\n          6.92,\n          117.11,\n          524.96,\n          6.92,\n          31.79,\n          117.11,\n          31.79,\n          159.42,\n          90.93,\n          6.92,\n          502.54,\n          31.79,\n          56.67,\n          35.84,\n          159.42,\n          6.92,\n          31.79,\n          35.84,\n          117.11,\n          6.92,\n          502.54,\n          56.67,\n          159.42,\n          6.92,\n          159.42,\n          524.96,\n          6.92,\n          6.92,\n          117.11,\n          364.69,\n          35.84,\n          56.67,\n          263.33,\n          31.79,\n          159.42,\n          364.69,\n          364.69,\n          117.11,\n          159.42,\n          263.33,\n          6.92,\n          117.11,\n          159.42,\n          97.44,\n          502.54,\n          263.33,\n          90.93,\n          502.54,\n          159.42,\n          56.67,\n          263.33,\n          31.79,\n          524.96,\n          364.69,\n          35.84,\n          97.44,\n          117.11,\n          263.33,\n          263.33\n        ],\n        "unexpected_percent": 100.0,\n        "unexpected_percent_nonmissing": 100.0,\n        "unexpected_percent_total": 100.0\n      },\n      "success": false\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 3,\n    "success_percent": 66.66666666666666,\n    "successful_expectations": 2,\n    "unsuccessful_expectations": 1\n  },\n  "success": false\n}
suite_2	checkpoint_2-20220616-115418	20220616T115418.201062Z	4b713199ec1ff5ba9040f5c796cb20d3	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Customer_OrderData.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "local2"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220616T115419.538388Z",\n      "pandas_data_fingerprint": "8c01a7f129832be7e2c611cbc5c25ba0"\n    },\n    "batch_spec": {\n      "path": "ge_core\\\\temp\\\\local2\\\\Customer_OrderData.csv"\n    },\n    "expectation_suite_name": "suite_2",\n    "great_expectations_version": "0.15.7",\n    "run_id": {\n      "run_name": "checkpoint_2-20220616-115418",\n      "run_time": "2022-06-16T11:54:18.201062+00:00"\n    },\n    "validation_time": "20220616T115419.602894Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_of_type",\n        "kwargs": {\n          "batch_id": "4b713199ec1ff5ba9040f5c796cb20d3",\n          "column": "Name",\n          "cost": 0,\n          "mostly": 0.8,\n          "type_": "str"\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_unique",\n        "kwargs": {\n          "batch_id": "4b713199ec1ff5ba9040f5c796cb20d3",\n          "column": "Email Address",\n          "cost": "10",\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_between",\n        "kwargs": {\n          "batch_id": "4b713199ec1ff5ba9040f5c796cb20d3",\n          "column": "Unit Cost",\n          "cost": "10",\n          "max_value": 1000000,\n          "min_value": 10000,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 17,\n            "value": 263.33\n          },\n          {\n            "count": 14,\n            "value": 6.92\n          },\n          {\n            "count": 12,\n            "value": 31.79\n          },\n          {\n            "count": 12,\n            "value": 502.54\n          },\n          {\n            "count": 11,\n            "value": 35.84\n          },\n          {\n            "count": 10,\n            "value": 117.11\n          },\n          {\n            "count": 9,\n            "value": 56.67\n          },\n          {\n            "count": 9,\n            "value": 159.42\n          },\n          {\n            "count": 9,\n            "value": 364.69\n          },\n          {\n            "count": 9,\n            "value": 524.96\n          },\n          {\n            "count": 5,\n            "value": 97.44\n          },\n          {\n            "count": 3,\n            "value": 90.93\n          }\n        ],\n        "partial_unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19\n        ],\n        "partial_unexpected_list": [\n          6.92,\n          35.84,\n          364.69,\n          35.84,\n          31.79,\n          6.92,\n          31.79,\n          31.79,\n          524.96,\n          263.33,\n          6.92,\n          263.33,\n          97.44,\n          35.84,\n          56.67,\n          56.67,\n          524.96,\n          263.33,\n          263.33,\n          56.67\n        ],\n        "unexpected_count": 120,\n        "unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19,\n          20,\n          21,\n          22,\n          23,\n          24,\n          25,\n          26,\n          27,\n          28,\n          29,\n          30,\n          31,\n          32,\n          33,\n          34,\n          35,\n          36,\n          37,\n          38,\n          39,\n          40,\n          41,\n          42,\n          43,\n          44,\n          45,\n          46,\n          47,\n          48,\n          49,\n          50,\n          51,\n          52,\n          53,\n          54,\n          55,\n          56,\n          57,\n          58,\n          59,\n          60,\n          61,\n          62,\n          63,\n          64,\n          65,\n          66,\n          67,\n          68,\n          69,\n          70,\n          71,\n          72,\n          73,\n          74,\n          75,\n          76,\n          77,\n          78,\n          79,\n          80,\n          81,\n          82,\n          83,\n          84,\n          85,\n          86,\n          87,\n          88,\n          89,\n          90,\n          91,\n          92,\n          93,\n          94,\n          95,\n          96,\n          97,\n          98,\n          99,\n          100,\n          101,\n          102,\n          103,\n          104,\n          105,\n          106,\n          107,\n          108,\n          109,\n          110,\n          111,\n          112,\n          113,\n          114,\n          115,\n          116,\n          117,\n          118,\n          119\n        ],\n        "unexpected_list": [\n          6.92,\n          35.84,\n          364.69,\n          35.84,\n          31.79,\n          6.92,\n          31.79,\n          31.79,\n          524.96,\n          263.33,\n          6.92,\n          263.33,\n          97.44,\n          35.84,\n          56.67,\n          56.67,\n          524.96,\n          263.33,\n          263.33,\n          56.67,\n          524.96,\n          502.54,\n          90.93,\n          263.33,\n          159.42,\n          524.96,\n          263.33,\n          502.54,\n          524.96,\n          502.54,\n          31.79,\n          6.92,\n          97.44,\n          502.54,\n          97.44,\n          263.33,\n          56.67,\n          502.54,\n          263.33,\n          502.54,\n          35.84,\n          35.84,\n          117.11,\n          31.79,\n          502.54,\n          263.33,\n          35.84,\n          263.33,\n          364.69,\n          6.92,\n          364.69,\n          502.54,\n          524.96,\n          263.33,\n          364.69,\n          364.69,\n          35.84,\n          117.11,\n          31.79,\n          117.11,\n          56.67,\n          6.92,\n          117.11,\n          524.96,\n          6.92,\n          31.79,\n          117.11,\n          31.79,\n          159.42,\n          90.93,\n          6.92,\n          502.54,\n          31.79,\n          56.67,\n          35.84,\n          159.42,\n          6.92,\n          31.79,\n          35.84,\n          117.11,\n          6.92,\n          502.54,\n          56.67,\n          159.42,\n          6.92,\n          159.42,\n          524.96,\n          6.92,\n          6.92,\n          117.11,\n          364.69,\n          35.84,\n          56.67,\n          263.33,\n          31.79,\n          159.42,\n          364.69,\n          364.69,\n          117.11,\n          159.42,\n          263.33,\n          6.92,\n          117.11,\n          159.42,\n          97.44,\n          502.54,\n          263.33,\n          90.93,\n          502.54,\n          159.42,\n          56.67,\n          263.33,\n          31.79,\n          524.96,\n          364.69,\n          35.84,\n          97.44,\n          117.11,\n          263.33,\n          263.33\n        ],\n        "unexpected_percent": 100.0,\n        "unexpected_percent_nonmissing": 100.0,\n        "unexpected_percent_total": 100.0\n      },\n      "success": false\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 3,\n    "success_percent": 66.66666666666666,\n    "successful_expectations": 2,\n    "unsuccessful_expectations": 1\n  },\n  "success": false\n}
suite_3	SAMPLE_RUN-20220616-115813	20220616T115813.451059Z	5cc261183f174463f79c5e6acd5915a5	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Customer_OrderData.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "local"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220616T115814.773028Z",\n      "pandas_data_fingerprint": "8c01a7f129832be7e2c611cbc5c25ba0"\n    },\n    "batch_spec": {\n      "path": "ge_core\\\\temp\\\\local\\\\Customer_OrderData.csv"\n    },\n    "expectation_suite_name": "suite_3",\n    "great_expectations_version": "0.15.7",\n    "run_id": {\n      "run_name": "SAMPLE_RUN-20220616-115813",\n      "run_time": "2022-06-16T11:58:13.451059+00:00"\n    },\n    "validation_time": "20220616T115814.839047Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_of_type",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Name",\n          "cost": "10",\n          "mostly": 0.8,\n          "type_": "str"\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_not_be_null",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Total Revenue",\n          "cost": 0,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_increasing",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Order ID",\n          "cost": 0,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 1,\n            "value": 116205585\n          },\n          {\n            "count": 1,\n            "value": 174590194\n          },\n          {\n            "count": 1,\n            "value": 176461303\n          },\n          {\n            "count": 1,\n            "value": 198927056\n          },\n          {\n            "count": 1,\n            "value": 222504317\n          },\n          {\n            "count": 1,\n            "value": 246248090\n          },\n          {\n            "count": 1,\n            "value": 274930989\n          },\n          {\n            "count": 1,\n            "value": 314505374\n          },\n          {\n            "count": 1,\n            "value": 324669444\n          },\n          {\n            "count": 1,\n            "value": 358570849\n          },\n          {\n            "count": 1,\n            "value": 425418365\n          },\n          {\n            "count": 1,\n            "value": 425793445\n          },\n          {\n            "count": 1,\n            "value": 440306556\n          },\n          {\n            "count": 1,\n            "value": 459386289\n          },\n          {\n            "count": 1,\n            "value": 571997869\n          },\n          {\n            "count": 1,\n            "value": 601245963\n          },\n          {\n            "count": 1,\n            "value": 710296428\n          },\n          {\n            "count": 1,\n            "value": 732588374\n          },\n          {\n            "count": 1,\n            "value": 807785928\n          },\n          {\n            "count": 1,\n            "value": 880811536\n          }\n        ],\n        "partial_unexpected_index_list": [\n          3,\n          4,\n          6,\n          8,\n          10,\n          12,\n          14,\n          17,\n          18,\n          19,\n          22,\n          25,\n          27,\n          28,\n          31,\n          32,\n          34,\n          36,\n          38,\n          39\n        ],\n        "partial_unexpected_list": [\n          880811536,\n          174590194,\n          425793445,\n          601245963,\n          732588374,\n          176461303,\n          314505374,\n          807785928,\n          324669444,\n          246248090,\n          116205585,\n          198927056,\n          459386289,\n          425418365,\n          571997869,\n          440306556,\n          710296428,\n          222504317,\n          358570849,\n          274930989\n        ],\n        "unexpected_count": 60,\n        "unexpected_index_list": [\n          3,\n          4,\n          6,\n          8,\n          10,\n          12,\n          14,\n          17,\n          18,\n          19,\n          22,\n          25,\n          27,\n          28,\n          31,\n          32,\n          34,\n          36,\n          38,\n          39,\n          41,\n          42,\n          44,\n          46,\n          49,\n          52,\n          54,\n          55,\n          57,\n          58,\n          60,\n          62,\n          65,\n          67,\n          69,\n          73,\n          75,\n          76,\n          79,\n          81,\n          84,\n          85,\n          87,\n          90,\n          91,\n          92,\n          95,\n          97,\n          99,\n          101,\n          103,\n          105,\n          106,\n          108,\n          109,\n          112,\n          113,\n          116,\n          117,\n          119\n        ],\n        "unexpected_list": [\n          880811536,\n          174590194,\n          425793445,\n          601245963,\n          732588374,\n          176461303,\n          314505374,\n          807785928,\n          324669444,\n          246248090,\n          116205585,\n          198927056,\n          459386289,\n          425418365,\n          571997869,\n          440306556,\n          710296428,\n          222504317,\n          358570849,\n          274930989,\n          548299157,\n          153842341,\n          101328551,\n          349235904,\n          156530129,\n          286891067,\n          252889239,\n          179137074,\n          887124383,\n          467399013,\n          104191863,\n          294530856,\n          265081918,\n          529276502,\n          642134416,\n          315402734,\n          839094388,\n          434008300,\n          156295812,\n          363086831,\n          496523940,\n          343752610,\n          180908620,\n          500371730,\n          494570004,\n          190777862,\n          146634709,\n          450544869,\n          290227735,\n          484823930,\n          278474080,\n          940318810,\n          219787776,\n          274500548,\n          270154511,\n          529330146,\n          527456033,\n          213969314,\n          165348374,\n          140492665\n        ],\n        "unexpected_percent": 50.0,\n        "unexpected_percent_nonmissing": 50.0,\n        "unexpected_percent_total": 50.0\n      },\n      "success": false\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_between",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Unit Cost",\n          "cost": 0,\n          "max_value": 1000000,\n          "min_value": 1000,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 17,\n            "value": 263.33\n          },\n          {\n            "count": 14,\n            "value": 6.92\n          },\n          {\n            "count": 12,\n            "value": 31.79\n          },\n          {\n            "count": 12,\n            "value": 502.54\n          },\n          {\n            "count": 11,\n            "value": 35.84\n          },\n          {\n            "count": 10,\n            "value": 117.11\n          },\n          {\n            "count": 9,\n            "value": 56.67\n          },\n          {\n            "count": 9,\n            "value": 159.42\n          },\n          {\n            "count": 9,\n            "value": 364.69\n          },\n          {\n            "count": 9,\n            "value": 524.96\n          },\n          {\n            "count": 5,\n            "value": 97.44\n          },\n          {\n            "count": 3,\n            "value": 90.93\n          }\n        ],\n        "partial_unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19\n        ],\n        "partial_unexpected_list": [\n          6.92,\n          35.84,\n          364.69,\n          35.84,\n          31.79,\n          6.92,\n          31.79,\n          31.79,\n          524.96,\n          263.33,\n          6.92,\n          263.33,\n          97.44,\n          35.84,\n          56.67,\n          56.67,\n          524.96,\n          263.33,\n          263.33,\n          56.67\n        ],\n        "unexpected_count": 120,\n        "unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19,\n          20,\n          21,\n          22,\n          23,\n          24,\n          25,\n          26,\n          27,\n          28,\n          29,\n          30,\n          31,\n          32,\n          33,\n          34,\n          35,\n          36,\n          37,\n          38,\n          39,\n          40,\n          41,\n          42,\n          43,\n          44,\n          45,\n          46,\n          47,\n          48,\n          49,\n          50,\n          51,\n          52,\n          53,\n          54,\n          55,\n          56,\n          57,\n          58,\n          59,\n          60,\n          61,\n          62,\n          63,\n          64,\n          65,\n          66,\n          67,\n          68,\n          69,\n          70,\n          71,\n          72,\n          73,\n          74,\n          75,\n          76,\n          77,\n          78,\n          79,\n          80,\n          81,\n          82,\n          83,\n          84,\n          85,\n          86,\n          87,\n          88,\n          89,\n          90,\n          91,\n          92,\n          93,\n          94,\n          95,\n          96,\n          97,\n          98,\n          99,\n          100,\n          101,\n          102,\n          103,\n          104,\n          105,\n          106,\n          107,\n          108,\n          109,\n          110,\n          111,\n          112,\n          113,\n          114,\n          115,\n          116,\n          117,\n          118,\n          119\n        ],\n        "unexpected_list": [\n          6.92,\n          35.84,\n          364.69,\n          35.84,\n          31.79,\n          6.92,\n          31.79,\n          31.79,\n          524.96,\n          263.33,\n          6.92,\n          263.33,\n          97.44,\n          35.84,\n          56.67,\n          56.67,\n          524.96,\n          263.33,\n          263.33,\n          56.67,\n          524.96,\n          502.54,\n          90.93,\n          263.33,\n          159.42,\n          524.96,\n          263.33,\n          502.54,\n          524.96,\n          502.54,\n          31.79,\n          6.92,\n          97.44,\n          502.54,\n          97.44,\n          263.33,\n          56.67,\n          502.54,\n          263.33,\n          502.54,\n          35.84,\n          35.84,\n          117.11,\n          31.79,\n          502.54,\n          263.33,\n          35.84,\n          263.33,\n          364.69,\n          6.92,\n          364.69,\n          502.54,\n          524.96,\n          263.33,\n          364.69,\n          364.69,\n          35.84,\n          117.11,\n          31.79,\n          117.11,\n          56.67,\n          6.92,\n          117.11,\n          524.96,\n          6.92,\n          31.79,\n          117.11,\n          31.79,\n          159.42,\n          90.93,\n          6.92,\n          502.54,\n          31.79,\n          56.67,\n          35.84,\n          159.42,\n          6.92,\n          31.79,\n          35.84,\n          117.11,\n          6.92,\n          502.54,\n          56.67,\n          159.42,\n          6.92,\n          159.42,\n          524.96,\n          6.92,\n          6.92,\n          117.11,\n          364.69,\n          35.84,\n          56.67,\n          263.33,\n          31.79,\n          159.42,\n          364.69,\n          364.69,\n          117.11,\n          159.42,\n          263.33,\n          6.92,\n          117.11,\n          159.42,\n          97.44,\n          502.54,\n          263.33,\n          90.93,\n          502.54,\n          159.42,\n          56.67,\n          263.33,\n          31.79,\n          524.96,\n          364.69,\n          35.84,\n          97.44,\n          117.11,\n          263.33,\n          263.33\n        ],\n        "unexpected_percent": 100.0,\n        "unexpected_percent_nonmissing": 100.0,\n        "unexpected_percent_total": 100.0\n      },\n      "success": false\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_min_to_be_between",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Unit Cost",\n          "cost": 0,\n          "max_value": 2000,\n          "min_value": 1000,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "observed_value": 6.92\n      },\n      "success": false\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_unique_value_count_to_be_between",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Extra ",\n          "cost": 0,\n          "max_value": 100,\n          "min_value": 0,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "observed_value": 119\n      },\n      "success": false\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 6,\n    "success_percent": 33.33333333333333,\n    "successful_expectations": null,\n    "unsuccessful_expectations": null\n  },\n  "success": false\n}
suite_2	checkpoint_1-20220616-115952	20220616T115952.785673Z	5cc261183f174463f79c5e6acd5915a5	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Customer_OrderData.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "local"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220616T115954.108642Z",\n      "pandas_data_fingerprint": "8c01a7f129832be7e2c611cbc5c25ba0"\n    },\n    "batch_spec": {\n      "path": "ge_core\\\\temp\\\\local\\\\Customer_OrderData.csv"\n    },\n    "expectation_suite_name": "suite_2",\n    "great_expectations_version": "0.15.7",\n    "run_id": {\n      "run_name": "checkpoint_1-20220616-115952",\n      "run_time": "2022-06-16T11:59:52.785673+00:00"\n    },\n    "validation_time": "20220616T115954.175157Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_of_type",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Name",\n          "cost": 0,\n          "mostly": 0.8,\n          "type_": "str"\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_unique",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Email Address",\n          "cost": "10",\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_between",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Unit Cost",\n          "cost": "10",\n          "max_value": 1000000,\n          "min_value": 10000,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 17,\n            "value": 263.33\n          },\n          {\n            "count": 14,\n            "value": 6.92\n          },\n          {\n            "count": 12,\n            "value": 31.79\n          },\n          {\n            "count": 12,\n            "value": 502.54\n          },\n          {\n            "count": 11,\n            "value": 35.84\n          },\n          {\n            "count": 10,\n            "value": 117.11\n          },\n          {\n            "count": 9,\n            "value": 56.67\n          },\n          {\n            "count": 9,\n            "value": 159.42\n          },\n          {\n            "count": 9,\n            "value": 364.69\n          },\n          {\n            "count": 9,\n            "value": 524.96\n          },\n          {\n            "count": 5,\n            "value": 97.44\n          },\n          {\n            "count": 3,\n            "value": 90.93\n          }\n        ],\n        "partial_unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19\n        ],\n        "partial_unexpected_list": [\n          6.92,\n          35.84,\n          364.69,\n          35.84,\n          31.79,\n          6.92,\n          31.79,\n          31.79,\n          524.96,\n          263.33,\n          6.92,\n          263.33,\n          97.44,\n          35.84,\n          56.67,\n          56.67,\n          524.96,\n          263.33,\n          263.33,\n          56.67\n        ],\n        "unexpected_count": 120,\n        "unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19,\n          20,\n          21,\n          22,\n          23,\n          24,\n          25,\n          26,\n          27,\n          28,\n          29,\n          30,\n          31,\n          32,\n          33,\n          34,\n          35,\n          36,\n          37,\n          38,\n          39,\n          40,\n          41,\n          42,\n          43,\n          44,\n          45,\n          46,\n          47,\n          48,\n          49,\n          50,\n          51,\n          52,\n          53,\n          54,\n          55,\n          56,\n          57,\n          58,\n          59,\n          60,\n          61,\n          62,\n          63,\n          64,\n          65,\n          66,\n          67,\n          68,\n          69,\n          70,\n          71,\n          72,\n          73,\n          74,\n          75,\n          76,\n          77,\n          78,\n          79,\n          80,\n          81,\n          82,\n          83,\n          84,\n          85,\n          86,\n          87,\n          88,\n          89,\n          90,\n          91,\n          92,\n          93,\n          94,\n          95,\n          96,\n          97,\n          98,\n          99,\n          100,\n          101,\n          102,\n          103,\n          104,\n          105,\n          106,\n          107,\n          108,\n          109,\n          110,\n          111,\n          112,\n          113,\n          114,\n          115,\n          116,\n          117,\n          118,\n          119\n        ],\n        "unexpected_list": [\n          6.92,\n          35.84,\n          364.69,\n          35.84,\n          31.79,\n          6.92,\n          31.79,\n          31.79,\n          524.96,\n          263.33,\n          6.92,\n          263.33,\n          97.44,\n          35.84,\n          56.67,\n          56.67,\n          524.96,\n          263.33,\n          263.33,\n          56.67,\n          524.96,\n          502.54,\n          90.93,\n          263.33,\n          159.42,\n          524.96,\n          263.33,\n          502.54,\n          524.96,\n          502.54,\n          31.79,\n          6.92,\n          97.44,\n          502.54,\n          97.44,\n          263.33,\n          56.67,\n          502.54,\n          263.33,\n          502.54,\n          35.84,\n          35.84,\n          117.11,\n          31.79,\n          502.54,\n          263.33,\n          35.84,\n          263.33,\n          364.69,\n          6.92,\n          364.69,\n          502.54,\n          524.96,\n          263.33,\n          364.69,\n          364.69,\n          35.84,\n          117.11,\n          31.79,\n          117.11,\n          56.67,\n          6.92,\n          117.11,\n          524.96,\n          6.92,\n          31.79,\n          117.11,\n          31.79,\n          159.42,\n          90.93,\n          6.92,\n          502.54,\n          31.79,\n          56.67,\n          35.84,\n          159.42,\n          6.92,\n          31.79,\n          35.84,\n          117.11,\n          6.92,\n          502.54,\n          56.67,\n          159.42,\n          6.92,\n          159.42,\n          524.96,\n          6.92,\n          6.92,\n          117.11,\n          364.69,\n          35.84,\n          56.67,\n          263.33,\n          31.79,\n          159.42,\n          364.69,\n          364.69,\n          117.11,\n          159.42,\n          263.33,\n          6.92,\n          117.11,\n          159.42,\n          97.44,\n          502.54,\n          263.33,\n          90.93,\n          502.54,\n          159.42,\n          56.67,\n          263.33,\n          31.79,\n          524.96,\n          364.69,\n          35.84,\n          97.44,\n          117.11,\n          263.33,\n          263.33\n        ],\n        "unexpected_percent": 100.0,\n        "unexpected_percent_nonmissing": 100.0,\n        "unexpected_percent_total": 100.0\n      },\n      "success": false\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 3,\n    "success_percent": 66.66666666666666,\n    "successful_expectations": 2,\n    "unsuccessful_expectations": 1\n  },\n  "success": false\n}
suite_5	SAMPLE_RUN-20220616-150009	20220616T150009.646764Z	ef88d3180d3bdb48c4ae3728585294b7	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Device_Telemetry_Daily.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "local"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220616T150011.028975Z",\n      "pandas_data_fingerprint": "815e1c837f7aec3597b512dfd9ef99e9"\n    },\n    "batch_spec": {\n      "path": "ge_core\\\\temp\\\\local\\\\Device_Telemetry_Daily.csv"\n    },\n    "expectation_suite_name": "suite_5",\n    "great_expectations_version": "0.15.7",\n    "run_id": {\n      "run_name": "SAMPLE_RUN-20220616-150009",\n      "run_time": "2022-06-16T15:00:09.646764+00:00"\n    },\n    "validation_time": "20220616T150011.089975Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_increasing",\n        "kwargs": {\n          "batch_id": "ef88d3180d3bdb48c4ae3728585294b7",\n          "column": "volt",\n          "cost": 0,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 44,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 2,\n            "value": 88.51551867\n          },\n          {\n            "count": 2,\n            "value": 97.84500357\n          },\n          {\n            "count": 2,\n            "value": 99.88716068\n          },\n          {\n            "count": 2,\n            "value": 113.0064137\n          },\n          {\n            "count": 2,\n            "value": 146.4313907\n          },\n          {\n            "count": 2,\n            "value": 180.9516792\n          },\n          {\n            "count": 2,\n            "value": 209.7247013\n          },\n          {\n            "count": 2,\n            "value": 210.2108051\n          },\n          {\n            "count": 2,\n            "value": 224.2240308\n          },\n          {\n            "count": 2,\n            "value": 228.3798712\n          },\n          {\n            "count": 1,\n            "value": 99.40581205\n          },\n          {\n            "count": 1,\n            "value": 176.7867079\n          },\n          {\n            "count": 1,\n            "value": 237.6601131\n          }\n        ],\n        "partial_unexpected_index_list": [\n          2,\n          3,\n          5,\n          6,\n          7,\n          10,\n          11,\n          14,\n          15,\n          17,\n          19,\n          21,\n          24,\n          25,\n          28,\n          29,\n          30,\n          31,\n          34,\n          36\n        ],\n        "partial_unexpected_list": [\n          228.3798712,\n          99.40581205,\n          228.3798712,\n          209.7247013,\n          97.84500357,\n          209.7247013,\n          97.84500357,\n          237.6601131,\n          210.2108051,\n          146.4313907,\n          210.2108051,\n          146.4313907,\n          224.2240308,\n          180.9516792,\n          224.2240308,\n          180.9516792,\n          176.7867079,\n          99.88716068,\n          99.88716068,\n          113.0064137\n        ],\n        "unexpected_count": 23,\n        "unexpected_index_list": [\n          2,\n          3,\n          5,\n          6,\n          7,\n          10,\n          11,\n          14,\n          15,\n          17,\n          19,\n          21,\n          24,\n          25,\n          28,\n          29,\n          30,\n          31,\n          34,\n          36,\n          38,\n          41,\n          43\n        ],\n        "unexpected_list": [\n          228.3798712,\n          99.40581205,\n          228.3798712,\n          209.7247013,\n          97.84500357,\n          209.7247013,\n          97.84500357,\n          237.6601131,\n          210.2108051,\n          146.4313907,\n          210.2108051,\n          146.4313907,\n          224.2240308,\n          180.9516792,\n          224.2240308,\n          180.9516792,\n          176.7867079,\n          99.88716068,\n          99.88716068,\n          113.0064137,\n          113.0064137,\n          88.51551867,\n          88.51551867\n        ],\n        "unexpected_percent": 52.27272727272727,\n        "unexpected_percent_nonmissing": 52.27272727272727,\n        "unexpected_percent_total": 52.27272727272727\n      },\n      "success": false\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_median_to_be_between",\n        "kwargs": {\n          "batch_id": "ef88d3180d3bdb48c4ae3728585294b7",\n          "column": "humidity",\n          "cost": 0,\n          "max_value": 100,\n          "min_value": 0,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "observed_value": 91.5\n      },\n      "success": true\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 2,\n    "success_percent": 50.0,\n    "successful_expectations": null,\n    "unsuccessful_expectations": null\n  },\n  "success": false\n}
suite_3	checkpoint3-20220616-120112	20220616T120112.863180Z	5cc261183f174463f79c5e6acd5915a5	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Customer_OrderData.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "local"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220616T120114.184594Z",\n      "pandas_data_fingerprint": "8c01a7f129832be7e2c611cbc5c25ba0"\n    },\n    "batch_spec": {\n      "path": "ge_core\\\\temp\\\\local\\\\Customer_OrderData.csv"\n    },\n    "expectation_suite_name": "suite_3",\n    "great_expectations_version": "0.15.7",\n    "run_id": {\n      "run_name": "checkpoint3-20220616-120112",\n      "run_time": "2022-06-16T12:01:12.863180+00:00"\n    },\n    "validation_time": "20220616T120114.250113Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_of_type",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Name",\n          "cost": "10",\n          "mostly": 0.8,\n          "type_": "str"\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_not_be_null",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Total Revenue",\n          "cost": 0,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_increasing",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Order ID",\n          "cost": 0,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 1,\n            "value": 116205585\n          },\n          {\n            "count": 1,\n            "value": 174590194\n          },\n          {\n            "count": 1,\n            "value": 176461303\n          },\n          {\n            "count": 1,\n            "value": 198927056\n          },\n          {\n            "count": 1,\n            "value": 222504317\n          },\n          {\n            "count": 1,\n            "value": 246248090\n          },\n          {\n            "count": 1,\n            "value": 274930989\n          },\n          {\n            "count": 1,\n            "value": 314505374\n          },\n          {\n            "count": 1,\n            "value": 324669444\n          },\n          {\n            "count": 1,\n            "value": 358570849\n          },\n          {\n            "count": 1,\n            "value": 425418365\n          },\n          {\n            "count": 1,\n            "value": 425793445\n          },\n          {\n            "count": 1,\n            "value": 440306556\n          },\n          {\n            "count": 1,\n            "value": 459386289\n          },\n          {\n            "count": 1,\n            "value": 571997869\n          },\n          {\n            "count": 1,\n            "value": 601245963\n          },\n          {\n            "count": 1,\n            "value": 710296428\n          },\n          {\n            "count": 1,\n            "value": 732588374\n          },\n          {\n            "count": 1,\n            "value": 807785928\n          },\n          {\n            "count": 1,\n            "value": 880811536\n          }\n        ],\n        "partial_unexpected_index_list": [\n          3,\n          4,\n          6,\n          8,\n          10,\n          12,\n          14,\n          17,\n          18,\n          19,\n          22,\n          25,\n          27,\n          28,\n          31,\n          32,\n          34,\n          36,\n          38,\n          39\n        ],\n        "partial_unexpected_list": [\n          880811536,\n          174590194,\n          425793445,\n          601245963,\n          732588374,\n          176461303,\n          314505374,\n          807785928,\n          324669444,\n          246248090,\n          116205585,\n          198927056,\n          459386289,\n          425418365,\n          571997869,\n          440306556,\n          710296428,\n          222504317,\n          358570849,\n          274930989\n        ],\n        "unexpected_count": 60,\n        "unexpected_index_list": [\n          3,\n          4,\n          6,\n          8,\n          10,\n          12,\n          14,\n          17,\n          18,\n          19,\n          22,\n          25,\n          27,\n          28,\n          31,\n          32,\n          34,\n          36,\n          38,\n          39,\n          41,\n          42,\n          44,\n          46,\n          49,\n          52,\n          54,\n          55,\n          57,\n          58,\n          60,\n          62,\n          65,\n          67,\n          69,\n          73,\n          75,\n          76,\n          79,\n          81,\n          84,\n          85,\n          87,\n          90,\n          91,\n          92,\n          95,\n          97,\n          99,\n          101,\n          103,\n          105,\n          106,\n          108,\n          109,\n          112,\n          113,\n          116,\n          117,\n          119\n        ],\n        "unexpected_list": [\n          880811536,\n          174590194,\n          425793445,\n          601245963,\n          732588374,\n          176461303,\n          314505374,\n          807785928,\n          324669444,\n          246248090,\n          116205585,\n          198927056,\n          459386289,\n          425418365,\n          571997869,\n          440306556,\n          710296428,\n          222504317,\n          358570849,\n          274930989,\n          548299157,\n          153842341,\n          101328551,\n          349235904,\n          156530129,\n          286891067,\n          252889239,\n          179137074,\n          887124383,\n          467399013,\n          104191863,\n          294530856,\n          265081918,\n          529276502,\n          642134416,\n          315402734,\n          839094388,\n          434008300,\n          156295812,\n          363086831,\n          496523940,\n          343752610,\n          180908620,\n          500371730,\n          494570004,\n          190777862,\n          146634709,\n          450544869,\n          290227735,\n          484823930,\n          278474080,\n          940318810,\n          219787776,\n          274500548,\n          270154511,\n          529330146,\n          527456033,\n          213969314,\n          165348374,\n          140492665\n        ],\n        "unexpected_percent": 50.0,\n        "unexpected_percent_nonmissing": 50.0,\n        "unexpected_percent_total": 50.0\n      },\n      "success": false\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_between",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Unit Cost",\n          "cost": 0,\n          "max_value": 1000000,\n          "min_value": 1000,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 17,\n            "value": 263.33\n          },\n          {\n            "count": 14,\n            "value": 6.92\n          },\n          {\n            "count": 12,\n            "value": 31.79\n          },\n          {\n            "count": 12,\n            "value": 502.54\n          },\n          {\n            "count": 11,\n            "value": 35.84\n          },\n          {\n            "count": 10,\n            "value": 117.11\n          },\n          {\n            "count": 9,\n            "value": 56.67\n          },\n          {\n            "count": 9,\n            "value": 159.42\n          },\n          {\n            "count": 9,\n            "value": 364.69\n          },\n          {\n            "count": 9,\n            "value": 524.96\n          },\n          {\n            "count": 5,\n            "value": 97.44\n          },\n          {\n            "count": 3,\n            "value": 90.93\n          }\n        ],\n        "partial_unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19\n        ],\n        "partial_unexpected_list": [\n          6.92,\n          35.84,\n          364.69,\n          35.84,\n          31.79,\n          6.92,\n          31.79,\n          31.79,\n          524.96,\n          263.33,\n          6.92,\n          263.33,\n          97.44,\n          35.84,\n          56.67,\n          56.67,\n          524.96,\n          263.33,\n          263.33,\n          56.67\n        ],\n        "unexpected_count": 120,\n        "unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19,\n          20,\n          21,\n          22,\n          23,\n          24,\n          25,\n          26,\n          27,\n          28,\n          29,\n          30,\n          31,\n          32,\n          33,\n          34,\n          35,\n          36,\n          37,\n          38,\n          39,\n          40,\n          41,\n          42,\n          43,\n          44,\n          45,\n          46,\n          47,\n          48,\n          49,\n          50,\n          51,\n          52,\n          53,\n          54,\n          55,\n          56,\n          57,\n          58,\n          59,\n          60,\n          61,\n          62,\n          63,\n          64,\n          65,\n          66,\n          67,\n          68,\n          69,\n          70,\n          71,\n          72,\n          73,\n          74,\n          75,\n          76,\n          77,\n          78,\n          79,\n          80,\n          81,\n          82,\n          83,\n          84,\n          85,\n          86,\n          87,\n          88,\n          89,\n          90,\n          91,\n          92,\n          93,\n          94,\n          95,\n          96,\n          97,\n          98,\n          99,\n          100,\n          101,\n          102,\n          103,\n          104,\n          105,\n          106,\n          107,\n          108,\n          109,\n          110,\n          111,\n          112,\n          113,\n          114,\n          115,\n          116,\n          117,\n          118,\n          119\n        ],\n        "unexpected_list": [\n          6.92,\n          35.84,\n          364.69,\n          35.84,\n          31.79,\n          6.92,\n          31.79,\n          31.79,\n          524.96,\n          263.33,\n          6.92,\n          263.33,\n          97.44,\n          35.84,\n          56.67,\n          56.67,\n          524.96,\n          263.33,\n          263.33,\n          56.67,\n          524.96,\n          502.54,\n          90.93,\n          263.33,\n          159.42,\n          524.96,\n          263.33,\n          502.54,\n          524.96,\n          502.54,\n          31.79,\n          6.92,\n          97.44,\n          502.54,\n          97.44,\n          263.33,\n          56.67,\n          502.54,\n          263.33,\n          502.54,\n          35.84,\n          35.84,\n          117.11,\n          31.79,\n          502.54,\n          263.33,\n          35.84,\n          263.33,\n          364.69,\n          6.92,\n          364.69,\n          502.54,\n          524.96,\n          263.33,\n          364.69,\n          364.69,\n          35.84,\n          117.11,\n          31.79,\n          117.11,\n          56.67,\n          6.92,\n          117.11,\n          524.96,\n          6.92,\n          31.79,\n          117.11,\n          31.79,\n          159.42,\n          90.93,\n          6.92,\n          502.54,\n          31.79,\n          56.67,\n          35.84,\n          159.42,\n          6.92,\n          31.79,\n          35.84,\n          117.11,\n          6.92,\n          502.54,\n          56.67,\n          159.42,\n          6.92,\n          159.42,\n          524.96,\n          6.92,\n          6.92,\n          117.11,\n          364.69,\n          35.84,\n          56.67,\n          263.33,\n          31.79,\n          159.42,\n          364.69,\n          364.69,\n          117.11,\n          159.42,\n          263.33,\n          6.92,\n          117.11,\n          159.42,\n          97.44,\n          502.54,\n          263.33,\n          90.93,\n          502.54,\n          159.42,\n          56.67,\n          263.33,\n          31.79,\n          524.96,\n          364.69,\n          35.84,\n          97.44,\n          117.11,\n          263.33,\n          263.33\n        ],\n        "unexpected_percent": 100.0,\n        "unexpected_percent_nonmissing": 100.0,\n        "unexpected_percent_total": 100.0\n      },\n      "success": false\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_min_to_be_between",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Unit Cost",\n          "cost": 0,\n          "max_value": 2000,\n          "min_value": 1000,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "observed_value": 6.92\n      },\n      "success": false\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_unique_value_count_to_be_between",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Extra ",\n          "cost": 0,\n          "max_value": 100,\n          "min_value": 0,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "observed_value": 119\n      },\n      "success": false\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 6,\n    "success_percent": 33.33333333333333,\n    "successful_expectations": null,\n    "unsuccessful_expectations": null\n  },\n  "success": false\n}
suite_3	checkpoint3-20220616-120343	20220616T120343.002441Z	5cc261183f174463f79c5e6acd5915a5	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Customer_OrderData.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "local"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220616T120344.327544Z",\n      "pandas_data_fingerprint": "8c01a7f129832be7e2c611cbc5c25ba0"\n    },\n    "batch_spec": {\n      "path": "ge_core\\\\temp\\\\local\\\\Customer_OrderData.csv"\n    },\n    "expectation_suite_name": "suite_3",\n    "great_expectations_version": "0.15.7",\n    "run_id": {\n      "run_name": "checkpoint3-20220616-120343",\n      "run_time": "2022-06-16T12:03:43.002441+00:00"\n    },\n    "validation_time": "20220616T120344.403544Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_of_type",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Name",\n          "cost": "10",\n          "mostly": 0.8,\n          "type_": "str"\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_not_be_null",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Total Revenue",\n          "cost": 0,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_increasing",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Order ID",\n          "cost": 0,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 1,\n            "value": 116205585\n          },\n          {\n            "count": 1,\n            "value": 174590194\n          },\n          {\n            "count": 1,\n            "value": 176461303\n          },\n          {\n            "count": 1,\n            "value": 198927056\n          },\n          {\n            "count": 1,\n            "value": 222504317\n          },\n          {\n            "count": 1,\n            "value": 246248090\n          },\n          {\n            "count": 1,\n            "value": 274930989\n          },\n          {\n            "count": 1,\n            "value": 314505374\n          },\n          {\n            "count": 1,\n            "value": 324669444\n          },\n          {\n            "count": 1,\n            "value": 358570849\n          },\n          {\n            "count": 1,\n            "value": 425418365\n          },\n          {\n            "count": 1,\n            "value": 425793445\n          },\n          {\n            "count": 1,\n            "value": 440306556\n          },\n          {\n            "count": 1,\n            "value": 459386289\n          },\n          {\n            "count": 1,\n            "value": 571997869\n          },\n          {\n            "count": 1,\n            "value": 601245963\n          },\n          {\n            "count": 1,\n            "value": 710296428\n          },\n          {\n            "count": 1,\n            "value": 732588374\n          },\n          {\n            "count": 1,\n            "value": 807785928\n          },\n          {\n            "count": 1,\n            "value": 880811536\n          }\n        ],\n        "partial_unexpected_index_list": [\n          3,\n          4,\n          6,\n          8,\n          10,\n          12,\n          14,\n          17,\n          18,\n          19,\n          22,\n          25,\n          27,\n          28,\n          31,\n          32,\n          34,\n          36,\n          38,\n          39\n        ],\n        "partial_unexpected_list": [\n          880811536,\n          174590194,\n          425793445,\n          601245963,\n          732588374,\n          176461303,\n          314505374,\n          807785928,\n          324669444,\n          246248090,\n          116205585,\n          198927056,\n          459386289,\n          425418365,\n          571997869,\n          440306556,\n          710296428,\n          222504317,\n          358570849,\n          274930989\n        ],\n        "unexpected_count": 60,\n        "unexpected_index_list": [\n          3,\n          4,\n          6,\n          8,\n          10,\n          12,\n          14,\n          17,\n          18,\n          19,\n          22,\n          25,\n          27,\n          28,\n          31,\n          32,\n          34,\n          36,\n          38,\n          39,\n          41,\n          42,\n          44,\n          46,\n          49,\n          52,\n          54,\n          55,\n          57,\n          58,\n          60,\n          62,\n          65,\n          67,\n          69,\n          73,\n          75,\n          76,\n          79,\n          81,\n          84,\n          85,\n          87,\n          90,\n          91,\n          92,\n          95,\n          97,\n          99,\n          101,\n          103,\n          105,\n          106,\n          108,\n          109,\n          112,\n          113,\n          116,\n          117,\n          119\n        ],\n        "unexpected_list": [\n          880811536,\n          174590194,\n          425793445,\n          601245963,\n          732588374,\n          176461303,\n          314505374,\n          807785928,\n          324669444,\n          246248090,\n          116205585,\n          198927056,\n          459386289,\n          425418365,\n          571997869,\n          440306556,\n          710296428,\n          222504317,\n          358570849,\n          274930989,\n          548299157,\n          153842341,\n          101328551,\n          349235904,\n          156530129,\n          286891067,\n          252889239,\n          179137074,\n          887124383,\n          467399013,\n          104191863,\n          294530856,\n          265081918,\n          529276502,\n          642134416,\n          315402734,\n          839094388,\n          434008300,\n          156295812,\n          363086831,\n          496523940,\n          343752610,\n          180908620,\n          500371730,\n          494570004,\n          190777862,\n          146634709,\n          450544869,\n          290227735,\n          484823930,\n          278474080,\n          940318810,\n          219787776,\n          274500548,\n          270154511,\n          529330146,\n          527456033,\n          213969314,\n          165348374,\n          140492665\n        ],\n        "unexpected_percent": 50.0,\n        "unexpected_percent_nonmissing": 50.0,\n        "unexpected_percent_total": 50.0\n      },\n      "success": false\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_between",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Unit Cost",\n          "cost": 0,\n          "max_value": 1000000,\n          "min_value": 1000,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 17,\n            "value": 263.33\n          },\n          {\n            "count": 14,\n            "value": 6.92\n          },\n          {\n            "count": 12,\n            "value": 31.79\n          },\n          {\n            "count": 12,\n            "value": 502.54\n          },\n          {\n            "count": 11,\n            "value": 35.84\n          },\n          {\n            "count": 10,\n            "value": 117.11\n          },\n          {\n            "count": 9,\n            "value": 56.67\n          },\n          {\n            "count": 9,\n            "value": 159.42\n          },\n          {\n            "count": 9,\n            "value": 364.69\n          },\n          {\n            "count": 9,\n            "value": 524.96\n          },\n          {\n            "count": 5,\n            "value": 97.44\n          },\n          {\n            "count": 3,\n            "value": 90.93\n          }\n        ],\n        "partial_unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19\n        ],\n        "partial_unexpected_list": [\n          6.92,\n          35.84,\n          364.69,\n          35.84,\n          31.79,\n          6.92,\n          31.79,\n          31.79,\n          524.96,\n          263.33,\n          6.92,\n          263.33,\n          97.44,\n          35.84,\n          56.67,\n          56.67,\n          524.96,\n          263.33,\n          263.33,\n          56.67\n        ],\n        "unexpected_count": 120,\n        "unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19,\n          20,\n          21,\n          22,\n          23,\n          24,\n          25,\n          26,\n          27,\n          28,\n          29,\n          30,\n          31,\n          32,\n          33,\n          34,\n          35,\n          36,\n          37,\n          38,\n          39,\n          40,\n          41,\n          42,\n          43,\n          44,\n          45,\n          46,\n          47,\n          48,\n          49,\n          50,\n          51,\n          52,\n          53,\n          54,\n          55,\n          56,\n          57,\n          58,\n          59,\n          60,\n          61,\n          62,\n          63,\n          64,\n          65,\n          66,\n          67,\n          68,\n          69,\n          70,\n          71,\n          72,\n          73,\n          74,\n          75,\n          76,\n          77,\n          78,\n          79,\n          80,\n          81,\n          82,\n          83,\n          84,\n          85,\n          86,\n          87,\n          88,\n          89,\n          90,\n          91,\n          92,\n          93,\n          94,\n          95,\n          96,\n          97,\n          98,\n          99,\n          100,\n          101,\n          102,\n          103,\n          104,\n          105,\n          106,\n          107,\n          108,\n          109,\n          110,\n          111,\n          112,\n          113,\n          114,\n          115,\n          116,\n          117,\n          118,\n          119\n        ],\n        "unexpected_list": [\n          6.92,\n          35.84,\n          364.69,\n          35.84,\n          31.79,\n          6.92,\n          31.79,\n          31.79,\n          524.96,\n          263.33,\n          6.92,\n          263.33,\n          97.44,\n          35.84,\n          56.67,\n          56.67,\n          524.96,\n          263.33,\n          263.33,\n          56.67,\n          524.96,\n          502.54,\n          90.93,\n          263.33,\n          159.42,\n          524.96,\n          263.33,\n          502.54,\n          524.96,\n          502.54,\n          31.79,\n          6.92,\n          97.44,\n          502.54,\n          97.44,\n          263.33,\n          56.67,\n          502.54,\n          263.33,\n          502.54,\n          35.84,\n          35.84,\n          117.11,\n          31.79,\n          502.54,\n          263.33,\n          35.84,\n          263.33,\n          364.69,\n          6.92,\n          364.69,\n          502.54,\n          524.96,\n          263.33,\n          364.69,\n          364.69,\n          35.84,\n          117.11,\n          31.79,\n          117.11,\n          56.67,\n          6.92,\n          117.11,\n          524.96,\n          6.92,\n          31.79,\n          117.11,\n          31.79,\n          159.42,\n          90.93,\n          6.92,\n          502.54,\n          31.79,\n          56.67,\n          35.84,\n          159.42,\n          6.92,\n          31.79,\n          35.84,\n          117.11,\n          6.92,\n          502.54,\n          56.67,\n          159.42,\n          6.92,\n          159.42,\n          524.96,\n          6.92,\n          6.92,\n          117.11,\n          364.69,\n          35.84,\n          56.67,\n          263.33,\n          31.79,\n          159.42,\n          364.69,\n          364.69,\n          117.11,\n          159.42,\n          263.33,\n          6.92,\n          117.11,\n          159.42,\n          97.44,\n          502.54,\n          263.33,\n          90.93,\n          502.54,\n          159.42,\n          56.67,\n          263.33,\n          31.79,\n          524.96,\n          364.69,\n          35.84,\n          97.44,\n          117.11,\n          263.33,\n          263.33\n        ],\n        "unexpected_percent": 100.0,\n        "unexpected_percent_nonmissing": 100.0,\n        "unexpected_percent_total": 100.0\n      },\n      "success": false\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_min_to_be_between",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Unit Cost",\n          "cost": 0,\n          "max_value": 2000,\n          "min_value": 1000,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "observed_value": 6.92\n      },\n      "success": false\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_unique_value_count_to_be_between",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Extra ",\n          "cost": 0,\n          "max_value": 100,\n          "min_value": 0,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "observed_value": 119\n      },\n      "success": false\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 6,\n    "success_percent": 33.33333333333333,\n    "successful_expectations": null,\n    "unsuccessful_expectations": null\n  },\n  "success": false\n}
suite_3	checkpoint3-20220616-120556	20220616T120556.579611Z	5cc261183f174463f79c5e6acd5915a5	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Customer_OrderData.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "local"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220616T120557.904282Z",\n      "pandas_data_fingerprint": "8c01a7f129832be7e2c611cbc5c25ba0"\n    },\n    "batch_spec": {\n      "path": "ge_core\\\\temp\\\\local\\\\Customer_OrderData.csv"\n    },\n    "expectation_suite_name": "suite_3",\n    "great_expectations_version": "0.15.7",\n    "run_id": {\n      "run_name": "checkpoint3-20220616-120556",\n      "run_time": "2022-06-16T12:05:56.579611+00:00"\n    },\n    "validation_time": "20220616T120557.974285Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_of_type",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Name",\n          "cost": "10",\n          "mostly": 0.8,\n          "type_": "str"\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_not_be_null",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Total Revenue",\n          "cost": 0,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_increasing",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Order ID",\n          "cost": 0,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 1,\n            "value": 116205585\n          },\n          {\n            "count": 1,\n            "value": 174590194\n          },\n          {\n            "count": 1,\n            "value": 176461303\n          },\n          {\n            "count": 1,\n            "value": 198927056\n          },\n          {\n            "count": 1,\n            "value": 222504317\n          },\n          {\n            "count": 1,\n            "value": 246248090\n          },\n          {\n            "count": 1,\n            "value": 274930989\n          },\n          {\n            "count": 1,\n            "value": 314505374\n          },\n          {\n            "count": 1,\n            "value": 324669444\n          },\n          {\n            "count": 1,\n            "value": 358570849\n          },\n          {\n            "count": 1,\n            "value": 425418365\n          },\n          {\n            "count": 1,\n            "value": 425793445\n          },\n          {\n            "count": 1,\n            "value": 440306556\n          },\n          {\n            "count": 1,\n            "value": 459386289\n          },\n          {\n            "count": 1,\n            "value": 571997869\n          },\n          {\n            "count": 1,\n            "value": 601245963\n          },\n          {\n            "count": 1,\n            "value": 710296428\n          },\n          {\n            "count": 1,\n            "value": 732588374\n          },\n          {\n            "count": 1,\n            "value": 807785928\n          },\n          {\n            "count": 1,\n            "value": 880811536\n          }\n        ],\n        "partial_unexpected_index_list": [\n          3,\n          4,\n          6,\n          8,\n          10,\n          12,\n          14,\n          17,\n          18,\n          19,\n          22,\n          25,\n          27,\n          28,\n          31,\n          32,\n          34,\n          36,\n          38,\n          39\n        ],\n        "partial_unexpected_list": [\n          880811536,\n          174590194,\n          425793445,\n          601245963,\n          732588374,\n          176461303,\n          314505374,\n          807785928,\n          324669444,\n          246248090,\n          116205585,\n          198927056,\n          459386289,\n          425418365,\n          571997869,\n          440306556,\n          710296428,\n          222504317,\n          358570849,\n          274930989\n        ],\n        "unexpected_count": 60,\n        "unexpected_index_list": [\n          3,\n          4,\n          6,\n          8,\n          10,\n          12,\n          14,\n          17,\n          18,\n          19,\n          22,\n          25,\n          27,\n          28,\n          31,\n          32,\n          34,\n          36,\n          38,\n          39,\n          41,\n          42,\n          44,\n          46,\n          49,\n          52,\n          54,\n          55,\n          57,\n          58,\n          60,\n          62,\n          65,\n          67,\n          69,\n          73,\n          75,\n          76,\n          79,\n          81,\n          84,\n          85,\n          87,\n          90,\n          91,\n          92,\n          95,\n          97,\n          99,\n          101,\n          103,\n          105,\n          106,\n          108,\n          109,\n          112,\n          113,\n          116,\n          117,\n          119\n        ],\n        "unexpected_list": [\n          880811536,\n          174590194,\n          425793445,\n          601245963,\n          732588374,\n          176461303,\n          314505374,\n          807785928,\n          324669444,\n          246248090,\n          116205585,\n          198927056,\n          459386289,\n          425418365,\n          571997869,\n          440306556,\n          710296428,\n          222504317,\n          358570849,\n          274930989,\n          548299157,\n          153842341,\n          101328551,\n          349235904,\n          156530129,\n          286891067,\n          252889239,\n          179137074,\n          887124383,\n          467399013,\n          104191863,\n          294530856,\n          265081918,\n          529276502,\n          642134416,\n          315402734,\n          839094388,\n          434008300,\n          156295812,\n          363086831,\n          496523940,\n          343752610,\n          180908620,\n          500371730,\n          494570004,\n          190777862,\n          146634709,\n          450544869,\n          290227735,\n          484823930,\n          278474080,\n          940318810,\n          219787776,\n          274500548,\n          270154511,\n          529330146,\n          527456033,\n          213969314,\n          165348374,\n          140492665\n        ],\n        "unexpected_percent": 50.0,\n        "unexpected_percent_nonmissing": 50.0,\n        "unexpected_percent_total": 50.0\n      },\n      "success": false\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_between",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Unit Cost",\n          "cost": 0,\n          "max_value": 1000000,\n          "min_value": 1000,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 17,\n            "value": 263.33\n          },\n          {\n            "count": 14,\n            "value": 6.92\n          },\n          {\n            "count": 12,\n            "value": 31.79\n          },\n          {\n            "count": 12,\n            "value": 502.54\n          },\n          {\n            "count": 11,\n            "value": 35.84\n          },\n          {\n            "count": 10,\n            "value": 117.11\n          },\n          {\n            "count": 9,\n            "value": 56.67\n          },\n          {\n            "count": 9,\n            "value": 159.42\n          },\n          {\n            "count": 9,\n            "value": 364.69\n          },\n          {\n            "count": 9,\n            "value": 524.96\n          },\n          {\n            "count": 5,\n            "value": 97.44\n          },\n          {\n            "count": 3,\n            "value": 90.93\n          }\n        ],\n        "partial_unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19\n        ],\n        "partial_unexpected_list": [\n          6.92,\n          35.84,\n          364.69,\n          35.84,\n          31.79,\n          6.92,\n          31.79,\n          31.79,\n          524.96,\n          263.33,\n          6.92,\n          263.33,\n          97.44,\n          35.84,\n          56.67,\n          56.67,\n          524.96,\n          263.33,\n          263.33,\n          56.67\n        ],\n        "unexpected_count": 120,\n        "unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19,\n          20,\n          21,\n          22,\n          23,\n          24,\n          25,\n          26,\n          27,\n          28,\n          29,\n          30,\n          31,\n          32,\n          33,\n          34,\n          35,\n          36,\n          37,\n          38,\n          39,\n          40,\n          41,\n          42,\n          43,\n          44,\n          45,\n          46,\n          47,\n          48,\n          49,\n          50,\n          51,\n          52,\n          53,\n          54,\n          55,\n          56,\n          57,\n          58,\n          59,\n          60,\n          61,\n          62,\n          63,\n          64,\n          65,\n          66,\n          67,\n          68,\n          69,\n          70,\n          71,\n          72,\n          73,\n          74,\n          75,\n          76,\n          77,\n          78,\n          79,\n          80,\n          81,\n          82,\n          83,\n          84,\n          85,\n          86,\n          87,\n          88,\n          89,\n          90,\n          91,\n          92,\n          93,\n          94,\n          95,\n          96,\n          97,\n          98,\n          99,\n          100,\n          101,\n          102,\n          103,\n          104,\n          105,\n          106,\n          107,\n          108,\n          109,\n          110,\n          111,\n          112,\n          113,\n          114,\n          115,\n          116,\n          117,\n          118,\n          119\n        ],\n        "unexpected_list": [\n          6.92,\n          35.84,\n          364.69,\n          35.84,\n          31.79,\n          6.92,\n          31.79,\n          31.79,\n          524.96,\n          263.33,\n          6.92,\n          263.33,\n          97.44,\n          35.84,\n          56.67,\n          56.67,\n          524.96,\n          263.33,\n          263.33,\n          56.67,\n          524.96,\n          502.54,\n          90.93,\n          263.33,\n          159.42,\n          524.96,\n          263.33,\n          502.54,\n          524.96,\n          502.54,\n          31.79,\n          6.92,\n          97.44,\n          502.54,\n          97.44,\n          263.33,\n          56.67,\n          502.54,\n          263.33,\n          502.54,\n          35.84,\n          35.84,\n          117.11,\n          31.79,\n          502.54,\n          263.33,\n          35.84,\n          263.33,\n          364.69,\n          6.92,\n          364.69,\n          502.54,\n          524.96,\n          263.33,\n          364.69,\n          364.69,\n          35.84,\n          117.11,\n          31.79,\n          117.11,\n          56.67,\n          6.92,\n          117.11,\n          524.96,\n          6.92,\n          31.79,\n          117.11,\n          31.79,\n          159.42,\n          90.93,\n          6.92,\n          502.54,\n          31.79,\n          56.67,\n          35.84,\n          159.42,\n          6.92,\n          31.79,\n          35.84,\n          117.11,\n          6.92,\n          502.54,\n          56.67,\n          159.42,\n          6.92,\n          159.42,\n          524.96,\n          6.92,\n          6.92,\n          117.11,\n          364.69,\n          35.84,\n          56.67,\n          263.33,\n          31.79,\n          159.42,\n          364.69,\n          364.69,\n          117.11,\n          159.42,\n          263.33,\n          6.92,\n          117.11,\n          159.42,\n          97.44,\n          502.54,\n          263.33,\n          90.93,\n          502.54,\n          159.42,\n          56.67,\n          263.33,\n          31.79,\n          524.96,\n          364.69,\n          35.84,\n          97.44,\n          117.11,\n          263.33,\n          263.33\n        ],\n        "unexpected_percent": 100.0,\n        "unexpected_percent_nonmissing": 100.0,\n        "unexpected_percent_total": 100.0\n      },\n      "success": false\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_min_to_be_between",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Unit Cost",\n          "cost": 0,\n          "max_value": 2000,\n          "min_value": 1000,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "observed_value": 6.92\n      },\n      "success": false\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_unique_value_count_to_be_between",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Extra ",\n          "cost": 0,\n          "max_value": 100,\n          "min_value": 0,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "observed_value": 119\n      },\n      "success": false\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 6,\n    "success_percent": 33.33333333333333,\n    "successful_expectations": null,\n    "unsuccessful_expectations": null\n  },\n  "success": false\n}
suite_7	SAMPLE_RUN-20220617-103721	20220617T103721.265406Z	ef88d3180d3bdb48c4ae3728585294b7	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Device_Telemetry_Daily.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "local"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220617T103722.593322Z",\n      "pandas_data_fingerprint": "815e1c837f7aec3597b512dfd9ef99e9"\n    },\n    "batch_spec": {\n      "path": "ge_core\\\\temp\\\\local\\\\Device_Telemetry_Daily.csv"\n    },\n    "expectation_suite_name": "suite_7",\n    "great_expectations_version": "0.15.7",\n    "run_id": {\n      "run_name": "SAMPLE_RUN-20220617-103721",\n      "run_time": "2022-06-17T10:37:21.265406+00:00"\n    },\n    "validation_time": "20220617T103722.663319Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_of_type",\n        "kwargs": {\n          "batch_id": "ef88d3180d3bdb48c4ae3728585294b7",\n          "column": "temperature",\n          "cost": 0,\n          "mostly": 0.8,\n          "type_": "int"\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "observed_value": "int64"\n      },\n      "success": false\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_increasing",\n        "kwargs": {\n          "batch_id": "ef88d3180d3bdb48c4ae3728585294b7",\n          "column": "uv",\n          "cost": 0,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 44,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 2,\n            "value": 0.050265646\n          },\n          {\n            "count": 2,\n            "value": 0.10252107\n          },\n          {\n            "count": 2,\n            "value": 0.146957567\n          },\n          {\n            "count": 2,\n            "value": 0.298846244\n          },\n          {\n            "count": 2,\n            "value": 0.336678525\n          },\n          {\n            "count": 2,\n            "value": 0.604392749\n          },\n          {\n            "count": 2,\n            "value": 0.681939936\n          },\n          {\n            "count": 1,\n            "value": 0.154734672\n          },\n          {\n            "count": 1,\n            "value": 0.189452231\n          },\n          {\n            "count": 1,\n            "value": 0.201383413\n          },\n          {\n            "count": 1,\n            "value": 0.230304766\n          },\n          {\n            "count": 1,\n            "value": 0.289774082\n          },\n          {\n            "count": 1,\n            "value": 0.427772637\n          },\n          {\n            "count": 1,\n            "value": 0.501820908\n          },\n          {\n            "count": 1,\n            "value": 0.642761185\n          },\n          {\n            "count": 1,\n            "value": 0.643491292\n          }\n        ],\n        "partial_unexpected_index_list": [\n          2,\n          3,\n          6,\n          7,\n          9,\n          10,\n          11,\n          13,\n          14,\n          19,\n          22,\n          25,\n          26,\n          28,\n          30,\n          31,\n          32,\n          34,\n          35,\n          38\n        ],\n        "partial_unexpected_list": [\n          0.643491292,\n          0.501820908,\n          0.298846244,\n          0.050265646,\n          0.681939936,\n          0.298846244,\n          0.050265646,\n          0.681939936,\n          0.154734672,\n          0.289774082,\n          0.336678525,\n          0.427772637,\n          0.336678525,\n          0.201383413,\n          0.230304766,\n          0.146957567,\n          0.10252107,\n          0.146957567,\n          0.10252107,\n          0.189452231\n        ],\n        "unexpected_count": 23,\n        "unexpected_index_list": [\n          2,\n          3,\n          6,\n          7,\n          9,\n          10,\n          11,\n          13,\n          14,\n          19,\n          22,\n          25,\n          26,\n          28,\n          30,\n          31,\n          32,\n          34,\n          35,\n          38,\n          40,\n          41,\n          43\n        ],\n        "unexpected_list": [\n          0.643491292,\n          0.501820908,\n          0.298846244,\n          0.050265646,\n          0.681939936,\n          0.298846244,\n          0.050265646,\n          0.681939936,\n          0.154734672,\n          0.289774082,\n          0.336678525,\n          0.427772637,\n          0.336678525,\n          0.201383413,\n          0.230304766,\n          0.146957567,\n          0.10252107,\n          0.146957567,\n          0.10252107,\n          0.189452231,\n          0.642761185,\n          0.604392749,\n          0.604392749\n        ],\n        "unexpected_percent": 52.27272727272727,\n        "unexpected_percent_nonmissing": 52.27272727272727,\n        "unexpected_percent_total": 52.27272727272727\n      },\n      "success": false\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_unique",\n        "kwargs": {\n          "batch_id": "ef88d3180d3bdb48c4ae3728585294b7",\n          "column": "rotate",\n          "cost": 0,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 44,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 2,\n            "value": 186.2672662\n          },\n          {\n            "count": 2,\n            "value": 221.4726566\n          },\n          {\n            "count": 2,\n            "value": 229.535193\n          },\n          {\n            "count": 2,\n            "value": 238.3907206\n          },\n          {\n            "count": 2,\n            "value": 251.1573028\n          },\n          {\n            "count": 2,\n            "value": 288.5911251\n          },\n          {\n            "count": 2,\n            "value": 318.7850744\n          },\n          {\n            "count": 2,\n            "value": 325.6856582\n          },\n          {\n            "count": 2,\n            "value": 343.0179767\n          },\n          {\n            "count": 2,\n            "value": 381.5861024\n          },\n          {\n            "count": 2,\n            "value": 387.6748063\n          },\n          {\n            "count": 2,\n            "value": 434.1628269\n          },\n          {\n            "count": 2,\n            "value": 464.0060286\n          },\n          {\n            "count": 2,\n            "value": 490.6006413\n          },\n          {\n            "count": 2,\n            "value": 499.6058845\n          },\n          {\n            "count": 2,\n            "value": 613.9563092\n          },\n          {\n            "count": 2,\n            "value": 619.166668\n          },\n          {\n            "count": 2,\n            "value": 677.1950753\n          },\n          {\n            "count": 2,\n            "value": 695.4698583\n          },\n          {\n            "count": 2,\n            "value": 699.2037267\n          }\n        ],\n        "partial_unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19\n        ],\n        "partial_unexpected_list": [\n          238.3907206,\n          229.535193,\n          288.5911251,\n          238.3907206,\n          229.535193,\n          288.5911251,\n          186.2672662,\n          343.0179767,\n          677.1950753,\n          221.4726566,\n          186.2672662,\n          343.0179767,\n          677.1950753,\n          221.4726566,\n          325.6856582,\n          699.2037267,\n          434.1628269,\n          695.4698583,\n          325.6856582,\n          699.2037267\n        ],\n        "unexpected_count": 44,\n        "unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19,\n          20,\n          21,\n          22,\n          23,\n          24,\n          25,\n          26,\n          27,\n          28,\n          29,\n          30,\n          31,\n          32,\n          33,\n          34,\n          35,\n          36,\n          37,\n          38,\n          39,\n          40,\n          41,\n          42,\n          43\n        ],\n        "unexpected_list": [\n          238.3907206,\n          229.535193,\n          288.5911251,\n          238.3907206,\n          229.535193,\n          288.5911251,\n          186.2672662,\n          343.0179767,\n          677.1950753,\n          221.4726566,\n          186.2672662,\n          343.0179767,\n          677.1950753,\n          221.4726566,\n          325.6856582,\n          699.2037267,\n          434.1628269,\n          695.4698583,\n          325.6856582,\n          699.2037267,\n          434.1628269,\n          695.4698583,\n          381.5861024,\n          499.6058845,\n          464.0060286,\n          613.9563092,\n          381.5861024,\n          499.6058845,\n          464.0060286,\n          613.9563092,\n          318.7850744,\n          251.1573028,\n          387.6748063,\n          318.7850744,\n          251.1573028,\n          387.6748063,\n          490.6006413,\n          619.166668,\n          490.6006413,\n          619.166668,\n          290.0377934,\n          617.9048075,\n          290.0377934,\n          617.9048075\n        ],\n        "unexpected_percent": 100.0,\n        "unexpected_percent_nonmissing": 100.0,\n        "unexpected_percent_total": 100.0\n      },\n      "success": false\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_between",\n        "kwargs": {\n          "batch_id": "ef88d3180d3bdb48c4ae3728585294b7",\n          "column": "volt",\n          "cost": 0,\n          "max_value": 400,\n          "min_value": 100,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 44,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 2,\n            "value": 88.51551867\n          },\n          {\n            "count": 2,\n            "value": 97.84500357\n          },\n          {\n            "count": 2,\n            "value": 99.40581205\n          },\n          {\n            "count": 2,\n            "value": 99.88716068\n          }\n        ],\n        "partial_unexpected_index_list": [\n          0,\n          3,\n          7,\n          11,\n          31,\n          34,\n          41,\n          43\n        ],\n        "partial_unexpected_list": [\n          99.40581205,\n          99.40581205,\n          97.84500357,\n          97.84500357,\n          99.88716068,\n          99.88716068,\n          88.51551867,\n          88.51551867\n        ],\n        "unexpected_count": 8,\n        "unexpected_index_list": [\n          0,\n          3,\n          7,\n          11,\n          31,\n          34,\n          41,\n          43\n        ],\n        "unexpected_list": [\n          99.40581205,\n          99.40581205,\n          97.84500357,\n          97.84500357,\n          99.88716068,\n          99.88716068,\n          88.51551867,\n          88.51551867\n        ],\n        "unexpected_percent": 18.181818181818183,\n        "unexpected_percent_nonmissing": 18.181818181818183,\n        "unexpected_percent_total": 18.181818181818183\n      },\n      "success": true\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 4,\n    "success_percent": 25.0,\n    "successful_expectations": 1,\n    "unsuccessful_expectations": 3\n  },\n  "success": false\n}
suite_8	SAMPLE_RUN-20220627-134413	20220627T134413.831116Z	ef88d3180d3bdb48c4ae3728585294b7	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Device_Telemetry_Daily.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "local"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220627T134415.173960Z",\n      "pandas_data_fingerprint": "815e1c837f7aec3597b512dfd9ef99e9"\n    },\n    "batch_spec": {\n      "path": "ge_core\\\\temp\\\\local\\\\Device_Telemetry_Daily.csv"\n    },\n    "expectation_suite_name": "suite_8",\n    "great_expectations_version": "0.15.7",\n    "run_id": {\n      "run_name": "SAMPLE_RUN-20220627-134413",\n      "run_time": "2022-06-27T13:44:13.831116+00:00"\n    },\n    "validation_time": "20220627T134415.236961Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_multicolumn_sum_to_equal",\n        "kwargs": {\n          "batch_id": "ef88d3180d3bdb48c4ae3728585294b7",\n          "column": "uv",\n          "column_list": [\n            "uv",\n            "temperature"\n          ],\n          "cost": 0,\n          "mostly": 0.8,\n          "sum_total": "sum_total"\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 44,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 2,\n            "value": [\n              0.050265646,\n              94\n            ]\n          },\n          {\n            "count": 2,\n            "value": [\n              0.10252107,\n              73\n            ]\n          },\n          {\n            "count": 2,\n            "value": [\n              0.146957567,\n              79\n            ]\n          },\n          {\n            "count": 2,\n            "value": [\n              0.189452231,\n              89\n            ]\n          },\n          {\n            "count": 2,\n            "value": [\n              0.230304766,\n              99\n            ]\n          },\n          {\n            "count": 2,\n            "value": [\n              0.289774082,\n              90\n            ]\n          },\n          {\n            "count": 2,\n            "value": [\n              0.336678525,\n              71\n            ]\n          },\n          {\n            "count": 2,\n            "value": [\n              0.427772637,\n              99\n            ]\n          },\n          {\n            "count": 2,\n            "value": [\n              0.431574496,\n              90\n            ]\n          },\n          {\n            "count": 2,\n            "value": [\n              0.501820908,\n              86\n            ]\n          },\n          {\n            "count": 2,\n            "value": [\n              0.604392749,\n              86\n            ]\n          },\n          {\n            "count": 2,\n            "value": [\n              0.642761185,\n              99\n            ]\n          },\n          {\n            "count": 2,\n            "value": [\n              0.643491292,\n              70\n            ]\n          },\n          {\n            "count": 2,\n            "value": [\n              0.794053352,\n              98\n            ]\n          },\n          {\n            "count": 2,\n            "value": [\n              0.826081275,\n              80\n            ]\n          },\n          {\n            "count": 2,\n            "value": [\n              0.91771425,\n              86\n            ]\n          },\n          {\n            "count": 1,\n            "value": [\n              0.298846244,\n              190\n            ]\n          },\n          {\n            "count": 1,\n            "value": [\n              0.605858145,\n              96\n            ]\n          },\n          {\n            "count": 1,\n            "value": [\n              1.605858145,\n              96\n            ]\n          },\n          {\n            "count": 1,\n            "value": [\n              2.694740291,\n              83\n            ]\n          }\n        ],\n        "partial_unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19\n        ],\n        "partial_unexpected_list": [\n          {\n            "temperature": 86,\n            "uv": 0.501820908\n          },\n          {\n            "temperature": 96,\n            "uv": 1.605858145\n          },\n          {\n            "temperature": 70,\n            "uv": 0.643491292\n          },\n          {\n            "temperature": 86,\n            "uv": 0.501820908\n          },\n          {\n            "temperature": 96,\n            "uv": 0.605858145\n          },\n          {\n            "temperature": 70,\n            "uv": 0.643491292\n          },\n          {\n            "temperature": 190,\n            "uv": 0.298846244\n          },\n          {\n            "temperature": 94,\n            "uv": 0.050265646\n          },\n          {\n            "temperature": 83,\n            "uv": 2.694740291\n          },\n          {\n            "temperature": 74,\n            "uv": 0.681939936\n          },\n          {\n            "temperature": 90,\n            "uv": 0.298846244\n          },\n          {\n            "temperature": 94,\n            "uv": 0.050265646\n          },\n          {\n            "temperature": 83,\n            "uv": 3.694740291\n          },\n          {\n            "temperature": 174,\n            "uv": 0.681939936\n          },\n          {\n            "temperature": 79,\n            "uv": 0.154734672\n          },\n          {\n            "temperature": 90,\n            "uv": 0.289774082\n          },\n          {\n            "temperature": 90,\n            "uv": 0.431574496\n          },\n          {\n            "temperature": 98,\n            "uv": 0.794053352\n          },\n          {\n            "temperature": 79,\n            "uv": 5.154734672\n          },\n          {\n            "temperature": 90,\n            "uv": 0.289774082\n          }\n        ],\n        "unexpected_count": 44,\n        "unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19,\n          20,\n          21,\n          22,\n          23,\n          24,\n          25,\n          26,\n          27,\n          28,\n          29,\n          30,\n          31,\n          32,\n          33,\n          34,\n          35,\n          36,\n          37,\n          38,\n          39,\n          40,\n          41,\n          42,\n          43\n        ],\n        "unexpected_list": [\n          {\n            "temperature": 86,\n            "uv": 0.501820908\n          },\n          {\n            "temperature": 96,\n            "uv": 1.605858145\n          },\n          {\n            "temperature": 70,\n            "uv": 0.643491292\n          },\n          {\n            "temperature": 86,\n            "uv": 0.501820908\n          },\n          {\n            "temperature": 96,\n            "uv": 0.605858145\n          },\n          {\n            "temperature": 70,\n            "uv": 0.643491292\n          },\n          {\n            "temperature": 190,\n            "uv": 0.298846244\n          },\n          {\n            "temperature": 94,\n            "uv": 0.050265646\n          },\n          {\n            "temperature": 83,\n            "uv": 2.694740291\n          },\n          {\n            "temperature": 74,\n            "uv": 0.681939936\n          },\n          {\n            "temperature": 90,\n            "uv": 0.298846244\n          },\n          {\n            "temperature": 94,\n            "uv": 0.050265646\n          },\n          {\n            "temperature": 83,\n            "uv": 3.694740291\n          },\n          {\n            "temperature": 174,\n            "uv": 0.681939936\n          },\n          {\n            "temperature": 79,\n            "uv": 0.154734672\n          },\n          {\n            "temperature": 90,\n            "uv": 0.289774082\n          },\n          {\n            "temperature": 90,\n            "uv": 0.431574496\n          },\n          {\n            "temperature": 98,\n            "uv": 0.794053352\n          },\n          {\n            "temperature": 79,\n            "uv": 5.154734672\n          },\n          {\n            "temperature": 90,\n            "uv": 0.289774082\n          },\n          {\n            "temperature": 90,\n            "uv": 0.431574496\n          },\n          {\n            "temperature": 98,\n            "uv": 0.794053352\n          },\n          {\n            "temperature": 71,\n            "uv": 0.336678525\n          },\n          {\n            "temperature": 86,\n            "uv": 0.91771425\n          },\n          {\n            "temperature": 192,\n            "uv": 4.201383413\n          },\n          {\n            "temperature": 99,\n            "uv": 0.427772637\n          },\n          {\n            "temperature": 71,\n            "uv": 0.336678525\n          },\n          {\n            "temperature": 86,\n            "uv": 0.91771425\n          },\n          {\n            "temperature": 92,\n            "uv": 0.201383413\n          },\n          {\n            "temperature": 99,\n            "uv": 0.427772637\n          },\n          {\n            "temperature": 99,\n            "uv": 0.230304766\n          },\n          {\n            "temperature": 79,\n            "uv": 0.146957567\n          },\n          {\n            "temperature": 73,\n            "uv": 0.10252107\n          },\n          {\n            "temperature": 99,\n            "uv": 0.230304766\n          },\n          {\n            "temperature": 79,\n            "uv": 0.146957567\n          },\n          {\n            "temperature": 73,\n            "uv": 0.10252107\n          },\n          {\n            "temperature": 89,\n            "uv": 0.189452231\n          },\n          {\n            "temperature": 80,\n            "uv": 0.826081275\n          },\n          {\n            "temperature": 89,\n            "uv": 0.189452231\n          },\n          {\n            "temperature": 80,\n            "uv": 0.826081275\n          },\n          {\n            "temperature": 99,\n            "uv": 0.642761185\n          },\n          {\n            "temperature": 86,\n            "uv": 0.604392749\n          },\n          {\n            "temperature": 99,\n            "uv": 0.642761185\n          },\n          {\n            "temperature": 86,\n            "uv": 0.604392749\n          }\n        ],\n        "unexpected_percent": 100.0,\n        "unexpected_percent_nonmissing": 100.0,\n        "unexpected_percent_total": 100.0\n      },\n      "success": false\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_increasing",\n        "kwargs": {\n          "batch_id": "ef88d3180d3bdb48c4ae3728585294b7",\n          "column": "humidity",\n          "cost": 0,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 44,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 4,\n            "value": 93\n          },\n          {\n            "count": 2,\n            "value": 70\n          },\n          {\n            "count": 2,\n            "value": 71\n          },\n          {\n            "count": 2,\n            "value": 73\n          },\n          {\n            "count": 2,\n            "value": 75\n          },\n          {\n            "count": 2,\n            "value": 76\n          },\n          {\n            "count": 2,\n            "value": 81\n          },\n          {\n            "count": 2,\n            "value": 84\n          },\n          {\n            "count": 2,\n            "value": 90\n          },\n          {\n            "count": 1,\n            "value": 74\n          },\n          {\n            "count": 1,\n            "value": 92\n          },\n          {\n            "count": 1,\n            "value": 96\n          }\n        ],\n        "partial_unexpected_index_list": [\n          1,\n          2,\n          4,\n          6,\n          7,\n          8,\n          11,\n          12,\n          14,\n          16,\n          18,\n          20,\n          22,\n          23,\n          26,\n          27,\n          30,\n          31,\n          34,\n          36\n        ],\n        "partial_unexpected_list": [\n          81,\n          74,\n          81,\n          96,\n          93,\n          75,\n          93,\n          75,\n          73,\n          71,\n          73,\n          71,\n          93,\n          70,\n          93,\n          70,\n          92,\n          76,\n          76,\n          84\n        ],\n        "unexpected_count": 23,\n        "unexpected_index_list": [\n          1,\n          2,\n          4,\n          6,\n          7,\n          8,\n          11,\n          12,\n          14,\n          16,\n          18,\n          20,\n          22,\n          23,\n          26,\n          27,\n          30,\n          31,\n          34,\n          36,\n          38,\n          41,\n          43\n        ],\n        "unexpected_list": [\n          81,\n          74,\n          81,\n          96,\n          93,\n          75,\n          93,\n          75,\n          73,\n          71,\n          73,\n          71,\n          93,\n          70,\n          93,\n          70,\n          92,\n          76,\n          76,\n          84,\n          84,\n          90,\n          90\n        ],\n        "unexpected_percent": 52.27272727272727,\n        "unexpected_percent_nonmissing": 52.27272727272727,\n        "unexpected_percent_total": 52.27272727272727\n      },\n      "success": false\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 2,\n    "success_percent": 0.0,\n    "successful_expectations": 0,\n    "unsuccessful_expectations": 2\n  },\n  "success": false\n}
suite_1	SAMPLE_RUN-20220616-142253	20220616T142253.813898Z	4b713199ec1ff5ba9040f5c796cb20d3	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Customer_OrderData.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "local2"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220616T142255.144433Z",\n      "pandas_data_fingerprint": "8c01a7f129832be7e2c611cbc5c25ba0"\n    },\n    "batch_spec": {\n      "path": "ge_core\\\\temp\\\\local2\\\\Customer_OrderData.csv"\n    },\n    "expectation_suite_name": "suite_1",\n    "great_expectations_version": "0.15.7",\n    "run_id": {\n      "run_name": "SAMPLE_RUN-20220616-142253",\n      "run_time": "2022-06-16T14:22:53.813898+00:00"\n    },\n    "validation_time": "20220616T142255.210432Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_of_type",\n        "kwargs": {\n          "batch_id": "4b713199ec1ff5ba9040f5c796cb20d3",\n          "column": "Name",\n          "cost": 0,\n          "mostly": 0.8,\n          "type_": "str"\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 1,\n    "success_percent": 100.0,\n    "successful_expectations": 1,\n    "unsuccessful_expectations": 0\n  },\n  "success": true\n}
wefdsfd	checkpoint105-20220627-134817	20220627T134817.774642Z	ef88d3180d3bdb48c4ae3728585294b7	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Device_Telemetry_Daily.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "local"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220627T134817.869886Z",\n      "pandas_data_fingerprint": "815e1c837f7aec3597b512dfd9ef99e9"\n    },\n    "batch_spec": {\n      "path": "ge_core/temp/local/Device_Telemetry_Daily.csv"\n    },\n    "expectation_suite_name": "wefdsfd",\n    "great_expectations_version": "0.15.11",\n    "run_id": {\n      "run_name": "checkpoint105-20220627-134817",\n      "run_time": "2022-06-27T13:48:17.774642+00:00"\n    },\n    "validation_time": "20220627T134818.242350Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_unique",\n        "kwargs": {\n          "batch_id": "ef88d3180d3bdb48c4ae3728585294b7",\n          "column": "pressure",\n          "cost": 0,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 44,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 2,\n            "value": 52.97325615\n          },\n          {\n            "count": 2,\n            "value": 60.29797315\n          },\n          {\n            "count": 2,\n            "value": 67.40381551\n          },\n          {\n            "count": 2,\n            "value": 73.21468712\n          },\n          {\n            "count": 2,\n            "value": 82.43375498\n          },\n          {\n            "count": 2,\n            "value": 95.85714394\n          },\n          {\n            "count": 2,\n            "value": 100.5658478\n          },\n          {\n            "count": 2,\n            "value": 115.487247\n          },\n          {\n            "count": 2,\n            "value": 121.6697073\n          },\n          {\n            "count": 2,\n            "value": 126.0742554\n          },\n          {\n            "count": 2,\n            "value": 126.1580148\n          },\n          {\n            "count": 2,\n            "value": 127.6928883\n          },\n          {\n            "count": 2,\n            "value": 144.2861663\n          },\n          {\n            "count": 2,\n            "value": 151.7977027\n          },\n          {\n            "count": 2,\n            "value": 169.0051786\n          },\n          {\n            "count": 2,\n            "value": 172.644545\n          },\n          {\n            "count": 2,\n            "value": 176.7142426\n          },\n          {\n            "count": 2,\n            "value": 195.2411252\n          },\n          {\n            "count": 2,\n            "value": 196.8500325\n          },\n          {\n            "count": 2,\n            "value": 199.6499437\n          }\n        ],\n        "partial_unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19\n        ],\n        "partial_unexpected_list": [\n          52.97325615,\n          172.644545,\n          100.5658478,\n          52.97325615,\n          172.644545,\n          100.5658478,\n          176.7142426,\n          95.85714394,\n          67.40381551,\n          126.1580148,\n          176.7142426,\n          95.85714394,\n          67.40381551,\n          126.1580148,\n          60.29797315,\n          115.487247,\n          199.6499437,\n          195.2411252,\n          60.29797315,\n          115.487247\n        ],\n        "unexpected_count": 44,\n        "unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19,\n          20,\n          21,\n          22,\n          23,\n          24,\n          25,\n          26,\n          27,\n          28,\n          29,\n          30,\n          31,\n          32,\n          33,\n          34,\n          35,\n          36,\n          37,\n          38,\n          39,\n          40,\n          41,\n          42,\n          43\n        ],\n        "unexpected_list": [\n          52.97325615,\n          172.644545,\n          100.5658478,\n          52.97325615,\n          172.644545,\n          100.5658478,\n          176.7142426,\n          95.85714394,\n          67.40381551,\n          126.1580148,\n          176.7142426,\n          95.85714394,\n          67.40381551,\n          126.1580148,\n          60.29797315,\n          115.487247,\n          199.6499437,\n          195.2411252,\n          60.29797315,\n          115.487247,\n          199.6499437,\n          195.2411252,\n          73.21468712,\n          169.0051786,\n          126.0742554,\n          151.7977027,\n          73.21468712,\n          169.0051786,\n          126.0742554,\n          151.7977027,\n          144.2861663,\n          82.43375498,\n          127.6928883,\n          144.2861663,\n          82.43375498,\n          127.6928883,\n          121.6697073,\n          196.8500325,\n          121.6697073,\n          196.8500325,\n          98.18841597,\n          198.7511658,\n          98.18841597,\n          198.7511658\n        ],\n        "unexpected_percent": 100.0,\n        "unexpected_percent_nonmissing": 100.0,\n        "unexpected_percent_total": 100.0\n      },\n      "success": false\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 1,\n    "success_percent": 0.0,\n    "successful_expectations": 0,\n    "unsuccessful_expectations": 1\n  },\n  "success": false\n}
Suite_100	Validation_100-20220628-070821	20220628T070821.571379Z	b3c90269c91d5315de1e62a6b1406a38	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Device_Telematry_Data - 1K.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "Demo File"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220628T070821.660069Z",\n      "pandas_data_fingerprint": "aea6ab32a8a866baaad0b940f64e1e46"\n    },\n    "batch_spec": {\n      "path": "ge_core/temp/Demo File/Device_Telematry_Data - 1K.csv"\n    },\n    "expectation_suite_name": "Suite_100",\n    "great_expectations_version": "0.15.11",\n    "run_id": {\n      "run_name": "Validation_100-20220628-070821",\n      "run_time": "2022-06-28T07:08:21.571379+00:00"\n    },\n    "validation_time": "20220628T070822.047254Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_not_be_null",\n        "kwargs": {\n          "batch_id": "b3c90269c91d5315de1e62a6b1406a38",\n          "column": "device_id",\n          "cost": "1000",\n          "mostly": 0.9\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 19,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_unique",\n        "kwargs": {\n          "batch_id": "b3c90269c91d5315de1e62a6b1406a38",\n          "column": "timestamp",\n          "cost": 0,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 19,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 10,\n            "value": "01-01-21 6:00"\n          },\n          {\n            "count": 9,\n            "value": "01-01-21 7:00"\n          }\n        ],\n        "partial_unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18\n        ],\n        "partial_unexpected_list": [\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 7:00",\n          "01-01-21 7:00",\n          "01-01-21 7:00",\n          "01-01-21 7:00",\n          "01-01-21 7:00",\n          "01-01-21 7:00",\n          "01-01-21 7:00",\n          "01-01-21 7:00",\n          "01-01-21 7:00"\n        ],\n        "unexpected_count": 19,\n        "unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18\n        ],\n        "unexpected_list": [\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 7:00",\n          "01-01-21 7:00",\n          "01-01-21 7:00",\n          "01-01-21 7:00",\n          "01-01-21 7:00",\n          "01-01-21 7:00",\n          "01-01-21 7:00",\n          "01-01-21 7:00",\n          "01-01-21 7:00"\n        ],\n        "unexpected_percent": 100.0,\n        "unexpected_percent_nonmissing": 100.0,\n        "unexpected_percent_total": 100.0\n      },\n      "success": false\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 2,\n    "success_percent": 50.0,\n    "successful_expectations": 1,\n    "unsuccessful_expectations": 1\n  },\n  "success": false\n}
suite_2	SAMPLE_RUN-20220514-110320	20220514T110320.266445Z	4b713199ec1ff5ba9040f5c796cb20d3	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Customer_OrderData.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "local2"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220614T110321.597470Z",\n      "pandas_data_fingerprint": "8c01a7f129832be7e2c611cbc5c25ba0"\n    },\n    "batch_spec": {\n      "path": "ge_core\\\\temp\\\\local2\\\\Customer_OrderData.csv"\n    },\n    "expectation_suite_name": "suite_2",\n    "great_expectations_version": "0.15.7",\n    "run_id": {\n      "run_name": "SAMPLE_RUN-20220614-110320",\n      "run_time": "2022-06-14T11:03:20.266445+00:00"\n    },\n    "validation_time": "20220614T110321.699473Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_of_type",\n        "kwargs": {\n          "batch_id": "4b713199ec1ff5ba9040f5c796cb20d3",\n          "column": "Name",\n          "cost": 0,\n          "mostly": 0.8,\n          "type_": "str"\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_unique",\n        "kwargs": {\n          "batch_id": "4b713199ec1ff5ba9040f5c796cb20d3",\n          "column": "Email Address",\n          "cost": "10",\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_between",\n        "kwargs": {\n          "batch_id": "4b713199ec1ff5ba9040f5c796cb20d3",\n          "column": "Unit Cost",\n          "cost": "10",\n          "max_value": 1000000,\n          "min_value": 10000,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 17,\n            "value": 263.33\n          },\n          {\n            "count": 14,\n            "value": 6.92\n          },\n          {\n            "count": 12,\n            "value": 31.79\n          },\n          {\n            "count": 12,\n            "value": 502.54\n          },\n          {\n            "count": 11,\n            "value": 35.84\n          },\n          {\n            "count": 10,\n            "value": 117.11\n          },\n          {\n            "count": 9,\n            "value": 56.67\n          },\n          {\n            "count": 9,\n            "value": 159.42\n          },\n          {\n            "count": 9,\n            "value": 364.69\n          },\n          {\n            "count": 9,\n            "value": 524.96\n          },\n          {\n            "count": 5,\n            "value": 97.44\n          },\n          {\n            "count": 3,\n            "value": 90.93\n          }\n        ],\n        "partial_unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19\n        ],\n        "partial_unexpected_list": [\n          6.92,\n          35.84,\n          364.69,\n          35.84,\n          31.79,\n          6.92,\n          31.79,\n          31.79,\n          524.96,\n          263.33,\n          6.92,\n          263.33,\n          97.44,\n          35.84,\n          56.67,\n          56.67,\n          524.96,\n          263.33,\n          263.33,\n          56.67\n        ],\n        "unexpected_count": 120,\n        "unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19,\n          20,\n          21,\n          22,\n          23,\n          24,\n          25,\n          26,\n          27,\n          28,\n          29,\n          30,\n          31,\n          32,\n          33,\n          34,\n          35,\n          36,\n          37,\n          38,\n          39,\n          40,\n          41,\n          42,\n          43,\n          44,\n          45,\n          46,\n          47,\n          48,\n          49,\n          50,\n          51,\n          52,\n          53,\n          54,\n          55,\n          56,\n          57,\n          58,\n          59,\n          60,\n          61,\n          62,\n          63,\n          64,\n          65,\n          66,\n          67,\n          68,\n          69,\n          70,\n          71,\n          72,\n          73,\n          74,\n          75,\n          76,\n          77,\n          78,\n          79,\n          80,\n          81,\n          82,\n          83,\n          84,\n          85,\n          86,\n          87,\n          88,\n          89,\n          90,\n          91,\n          92,\n          93,\n          94,\n          95,\n          96,\n          97,\n          98,\n          99,\n          100,\n          101,\n          102,\n          103,\n          104,\n          105,\n          106,\n          107,\n          108,\n          109,\n          110,\n          111,\n          112,\n          113,\n          114,\n          115,\n          116,\n          117,\n          118,\n          119\n        ],\n        "unexpected_list": [\n          6.92,\n          35.84,\n          364.69,\n          35.84,\n          31.79,\n          6.92,\n          31.79,\n          31.79,\n          524.96,\n          263.33,\n          6.92,\n          263.33,\n          97.44,\n          35.84,\n          56.67,\n          56.67,\n          524.96,\n          263.33,\n          263.33,\n          56.67,\n          524.96,\n          502.54,\n          90.93,\n          263.33,\n          159.42,\n          524.96,\n          263.33,\n          502.54,\n          524.96,\n          502.54,\n          31.79,\n          6.92,\n          97.44,\n          502.54,\n          97.44,\n          263.33,\n          56.67,\n          502.54,\n          263.33,\n          502.54,\n          35.84,\n          35.84,\n          117.11,\n          31.79,\n          502.54,\n          263.33,\n          35.84,\n          263.33,\n          364.69,\n          6.92,\n          364.69,\n          502.54,\n          524.96,\n          263.33,\n          364.69,\n          364.69,\n          35.84,\n          117.11,\n          31.79,\n          117.11,\n          56.67,\n          6.92,\n          117.11,\n          524.96,\n          6.92,\n          31.79,\n          117.11,\n          31.79,\n          159.42,\n          90.93,\n          6.92,\n          502.54,\n          31.79,\n          56.67,\n          35.84,\n          159.42,\n          6.92,\n          31.79,\n          35.84,\n          117.11,\n          6.92,\n          502.54,\n          56.67,\n          159.42,\n          6.92,\n          159.42,\n          524.96,\n          6.92,\n          6.92,\n          117.11,\n          364.69,\n          35.84,\n          56.67,\n          263.33,\n          31.79,\n          159.42,\n          364.69,\n          364.69,\n          117.11,\n          159.42,\n          263.33,\n          6.92,\n          117.11,\n          159.42,\n          97.44,\n          502.54,\n          263.33,\n          90.93,\n          502.54,\n          159.42,\n          56.67,\n          263.33,\n          31.79,\n          524.96,\n          364.69,\n          35.84,\n          97.44,\n          117.11,\n          263.33,\n          263.33\n        ],\n        "unexpected_percent": 100.0,\n        "unexpected_percent_nonmissing": 100.0,\n        "unexpected_percent_total": 100.0\n      },\n      "success": false\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 3,\n    "success_percent": 66.66666666666666,\n    "successful_expectations": 2,\n    "unsuccessful_expectations": 1\n  },\n  "success": false\n}
Suite_12	Validation_12-20220428-094141	20220428T094141.357005Z	b3c90269c91d5315de1e62a6b1406a38	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Device_Telematry_Data - 1K.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "Demo File"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220628T094141.441225Z",\n      "pandas_data_fingerprint": "aea6ab32a8a866baaad0b940f64e1e46"\n    },\n    "batch_spec": {\n      "path": "ge_core/temp/Demo File/Device_Telematry_Data - 1K.csv"\n    },\n    "expectation_suite_name": "Suite_12",\n    "great_expectations_version": "0.15.11",\n    "run_id": {\n      "run_name": "Validation_12-20220628-094141",\n      "run_time": "2022-06-28T09:41:41.357005+00:00"\n    },\n    "validation_time": "20220628T094141.972696Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": "unsupported operand type(s) for -: 'str' and 'str'",\n        "exception_traceback": "Traceback (most recent call last):\\n  File \\"/tmp/8da55c31cbe132c/antenv/lib/python3.9/site-packages/great_expectations/execution_engine/execution_engine.py\\", line 386, in resolve_metrics\\n    resolved_metrics[metric_to_resolve.id] = metric_fn(\\n  File \\"/tmp/8da55c31cbe132c/antenv/lib/python3.9/site-packages/great_expectations/expectations/metrics/metric_provider.py\\", line 55, in inner_func\\n    return metric_fn(*args, **kwargs)\\n  File \\"/tmp/8da55c31cbe132c/antenv/lib/python3.9/site-packages/great_expectations/expectations/metrics/map_metric_provider.py\\", line 331, in inner_func\\n    meets_expectation_series = metric_fn(\\n  File \\"/tmp/8da55c31cbe132c/antenv/lib/python3.9/site-packages/great_expectations/expectations/metrics/column_map_metrics/column_values_increasing.py\\", line 61, in _pandas\\n    series_diff = temp_column.diff()\\n  File \\"/tmp/8da55c31cbe132c/antenv/lib/python3.9/site-packages/pandas/core/series.py\\", line 2697, in diff\\n    result = algorithms.diff(self._values, periods)\\n  File \\"/tmp/8da55c31cbe132c/antenv/lib/python3.9/site-packages/pandas/core/algorithms.py\\", line 1651, in diff\\n    out_arr[res_indexer] = op(arr[res_indexer], arr[lag_indexer])\\nTypeError: unsupported operand type(s) for -: 'str' and 'str'\\n\\nDuring handling of the above exception, another exception occurred:\\n\\nTraceback (most recent call last):\\n  File \\"/tmp/8da55c31cbe132c/antenv/lib/python3.9/site-packages/great_expectations/validator/validator.py\\", line 1287, in resolve_validation_graph\\n    self._resolve_metrics(\\n  File \\"/tmp/8da55c31cbe132c/antenv/lib/python3.9/site-packages/great_expectations/validator/validator.py\\", line 2206, in _resolve_metrics\\n    return execution_engine.resolve_metrics(\\n  File \\"/tmp/8da55c31cbe132c/antenv/lib/python3.9/site-packages/great_expectations/execution_engine/execution_engine.py\\", line 390, in resolve_metrics\\n    raise ge_exceptions.MetricResolutionError(\\ngreat_expectations.exceptions.exceptions.MetricResolutionError: unsupported operand type(s) for -: 'str' and 'str'\\n",\n        "raised_exception": true\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_increasing",\n        "kwargs": {\n          "batch_id": "b3c90269c91d5315de1e62a6b1406a38",\n          "column": "timestamp",\n          "cost": "200",\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {},\n      "success": false\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_between",\n        "kwargs": {\n          "batch_id": "b3c90269c91d5315de1e62a6b1406a38",\n          "column": "volt",\n          "cost": "150",\n          "max_value": 100,\n          "min_value": 0,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 19,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 1,\n            "value": 136.8785885\n          },\n          {\n            "count": 1,\n            "value": 152.3491534\n          },\n          {\n            "count": 1,\n            "value": 153.1061184\n          },\n          {\n            "count": 1,\n            "value": 154.3968637\n          },\n          {\n            "count": 1,\n            "value": 156.0063913\n          },\n          {\n            "count": 1,\n            "value": 158.2820441\n          },\n          {\n            "count": 1,\n            "value": 158.4212606\n          },\n          {\n            "count": 1,\n            "value": 159.3793197\n          },\n          {\n            "count": 1,\n            "value": 165.0828994\n          },\n          {\n            "count": 1,\n            "value": 169.7108469\n          },\n          {\n            "count": 1,\n            "value": 174.6319508\n          },\n          {\n            "count": 1,\n            "value": 176.217853\n          },\n          {\n            "count": 1,\n            "value": 176.5589132\n          },\n          {\n            "count": 1,\n            "value": 179.8185164\n          },\n          {\n            "count": 1,\n            "value": 180.186857\n          },\n          {\n            "count": 1,\n            "value": 185.4820432\n          },\n          {\n            "count": 1,\n            "value": 192.7839953\n          },\n          {\n            "count": 1,\n            "value": 216.9135021\n          },\n          {\n            "count": 1,\n            "value": 223.8532964\n          }\n        ],\n        "partial_unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18\n        ],\n        "partial_unexpected_list": [\n          176.217853,\n          176.5589132,\n          185.4820432,\n          169.7108469,\n          165.0828994,\n          136.8785885,\n          156.0063913,\n          159.3793197,\n          223.8532964,\n          158.4212606,\n          174.6319508,\n          153.1061184,\n          152.3491534,\n          216.9135021,\n          154.3968637,\n          192.7839953,\n          180.186857,\n          179.8185164,\n          158.2820441\n        ],\n        "unexpected_count": 19,\n        "unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18\n        ],\n        "unexpected_list": [\n          176.217853,\n          176.5589132,\n          185.4820432,\n          169.7108469,\n          165.0828994,\n          136.8785885,\n          156.0063913,\n          159.3793197,\n          223.8532964,\n          158.4212606,\n          174.6319508,\n          153.1061184,\n          152.3491534,\n          216.9135021,\n          154.3968637,\n          192.7839953,\n          180.186857,\n          179.8185164,\n          158.2820441\n        ],\n        "unexpected_percent": 100.0,\n        "unexpected_percent_nonmissing": 100.0,\n        "unexpected_percent_total": 100.0\n      },\n      "success": false\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_max_to_be_between",\n        "kwargs": {\n          "batch_id": "b3c90269c91d5315de1e62a6b1406a38",\n          "column": "pressure",\n          "cost": "20",\n          "max_value": 100,\n          "min_value": 0,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "observed_value": 149.003582\n      },\n      "success": false\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 3,\n    "success_percent": 0.0,\n    "successful_expectations": 0,\n    "unsuccessful_expectations": 3\n  },\n  "success": false\n}
Suite_15	Validation_15-20220528-103602	20220528T103602.023869Z	b3c90269c91d5315de1e62a6b1406a38	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Device_Telematry_Data - 1K.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "Demo File"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220628T103602.103220Z",\n      "pandas_data_fingerprint": "aea6ab32a8a866baaad0b940f64e1e46"\n    },\n    "batch_spec": {\n      "path": "ge_core/temp/Demo File/Device_Telematry_Data - 1K.csv"\n    },\n    "expectation_suite_name": "Suite_15",\n    "great_expectations_version": "0.15.11",\n    "run_id": {\n      "run_name": "Validation_15-20220628-103602",\n      "run_time": "2022-06-28T10:36:02.023869+00:00"\n    },\n    "validation_time": "20220628T103602.543709Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": "unsupported operand type(s) for -: 'str' and 'str'",\n        "exception_traceback": "Traceback (most recent call last):\\n  File \\"/tmp/8da55c31cbe132c/antenv/lib/python3.9/site-packages/great_expectations/execution_engine/execution_engine.py\\", line 386, in resolve_metrics\\n    resolved_metrics[metric_to_resolve.id] = metric_fn(\\n  File \\"/tmp/8da55c31cbe132c/antenv/lib/python3.9/site-packages/great_expectations/expectations/metrics/metric_provider.py\\", line 55, in inner_func\\n    return metric_fn(*args, **kwargs)\\n  File \\"/tmp/8da55c31cbe132c/antenv/lib/python3.9/site-packages/great_expectations/expectations/metrics/map_metric_provider.py\\", line 331, in inner_func\\n    meets_expectation_series = metric_fn(\\n  File \\"/tmp/8da55c31cbe132c/antenv/lib/python3.9/site-packages/great_expectations/expectations/metrics/column_map_metrics/column_values_increasing.py\\", line 61, in _pandas\\n    series_diff = temp_column.diff()\\n  File \\"/tmp/8da55c31cbe132c/antenv/lib/python3.9/site-packages/pandas/core/series.py\\", line 2697, in diff\\n    result = algorithms.diff(self._values, periods)\\n  File \\"/tmp/8da55c31cbe132c/antenv/lib/python3.9/site-packages/pandas/core/algorithms.py\\", line 1651, in diff\\n    out_arr[res_indexer] = op(arr[res_indexer], arr[lag_indexer])\\nTypeError: unsupported operand type(s) for -: 'str' and 'str'\\n\\nDuring handling of the above exception, another exception occurred:\\n\\nTraceback (most recent call last):\\n  File \\"/tmp/8da55c31cbe132c/antenv/lib/python3.9/site-packages/great_expectations/validator/validator.py\\", line 1287, in resolve_validation_graph\\n    self._resolve_metrics(\\n  File \\"/tmp/8da55c31cbe132c/antenv/lib/python3.9/site-packages/great_expectations/validator/validator.py\\", line 2206, in _resolve_metrics\\n    return execution_engine.resolve_metrics(\\n  File \\"/tmp/8da55c31cbe132c/antenv/lib/python3.9/site-packages/great_expectations/execution_engine/execution_engine.py\\", line 390, in resolve_metrics\\n    raise ge_exceptions.MetricResolutionError(\\ngreat_expectations.exceptions.exceptions.MetricResolutionError: unsupported operand type(s) for -: 'str' and 'str'\\n",\n        "raised_exception": true\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_increasing",\n        "kwargs": {\n          "batch_id": "b3c90269c91d5315de1e62a6b1406a38",\n          "column": "ip_address",\n          "cost": 0,\n          "mostly": 0.2\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {},\n      "success": false\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_of_type",\n        "kwargs": {\n          "batch_id": "b3c90269c91d5315de1e62a6b1406a38",\n          "column": "device_status",\n          "cost": "20",\n          "mostly": 0.8,\n          "type_": "str"\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 19,\n        "missing_count": 1,\n        "missing_percent": 5.263157894736842,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_not_be_null",\n        "kwargs": {\n          "batch_id": "b3c90269c91d5315de1e62a6b1406a38",\n          "column": "ip_address",\n          "cost": "2",\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 19,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_decreasing",\n        "kwargs": {\n          "batch_id": "b3c90269c91d5315de1e62a6b1406a38",\n          "column": "rotate",\n          "cost": "20",\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 19,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 1,\n            "value": 424.6241621\n          },\n          {\n            "count": 1,\n            "value": 461.2111374\n          },\n          {\n            "count": 1,\n            "value": 463.6467269\n          },\n          {\n            "count": 1,\n            "value": 478.4097577\n          },\n          {\n            "count": 1,\n            "value": 492.0884196\n          },\n          {\n            "count": 1,\n            "value": 500.8308855\n          },\n          {\n            "count": 1,\n            "value": 504.9095338\n          },\n          {\n            "count": 1,\n            "value": 510.5411089\n          },\n          {\n            "count": 1,\n            "value": 515.3896733\n          },\n          {\n            "count": 1,\n            "value": 519.4979051\n          },\n          {\n            "count": 1,\n            "value": 538.763646\n          }\n        ],\n        "partial_unexpected_index_list": [\n          1,\n          2,\n          3,\n          5,\n          6,\n          9,\n          11,\n          12,\n          13,\n          15,\n          16\n        ],\n        "partial_unexpected_list": [\n          424.6241621,\n          461.2111374,\n          463.6467269,\n          492.0884196,\n          519.4979051,\n          500.8308855,\n          478.4097577,\n          504.9095338,\n          510.5411089,\n          515.3896733,\n          538.763646\n        ],\n        "unexpected_count": 11,\n        "unexpected_index_list": [\n          1,\n          2,\n          3,\n          5,\n          6,\n          9,\n          11,\n          12,\n          13,\n          15,\n          16\n        ],\n        "unexpected_list": [\n          424.6241621,\n          461.2111374,\n          463.6467269,\n          492.0884196,\n          519.4979051,\n          500.8308855,\n          478.4097577,\n          504.9095338,\n          510.5411089,\n          515.3896733,\n          538.763646\n        ],\n        "unexpected_percent": 57.89473684210527,\n        "unexpected_percent_nonmissing": 57.89473684210527,\n        "unexpected_percent_total": 57.89473684210527\n      },\n      "success": false\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_between",\n        "kwargs": {\n          "batch_id": "b3c90269c91d5315de1e62a6b1406a38",\n          "column": "rotate",\n          "cost": "26",\n          "max_value": 100,\n          "min_value": 0,\n          "mostly": 0.9\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 19,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 1,\n            "value": 356.9288214\n          },\n          {\n            "count": 1,\n            "value": 397.3081267\n          },\n          {\n            "count": 1,\n            "value": 409.4192167\n          },\n          {\n            "count": 1,\n            "value": 418.5040782\n          },\n          {\n            "count": 1,\n            "value": 424.6241621\n          },\n          {\n            "count": 1,\n            "value": 432.3729603\n          },\n          {\n            "count": 1,\n            "value": 450.4983412\n          },\n          {\n            "count": 1,\n            "value": 452.2835762\n          },\n          {\n            "count": 1,\n            "value": 461.2111374\n          },\n          {\n            "count": 1,\n            "value": 463.6467269\n          },\n          {\n            "count": 1,\n            "value": 478.4097577\n          },\n          {\n            "count": 1,\n            "value": 492.0884196\n          },\n          {\n            "count": 1,\n            "value": 500.8308855\n          },\n          {\n            "count": 1,\n            "value": 504.9095338\n          },\n          {\n            "count": 1,\n            "value": 510.5411089\n          },\n          {\n            "count": 1,\n            "value": 515.3896733\n          },\n          {\n            "count": 1,\n            "value": 519.1661847\n          },\n          {\n            "count": 1,\n            "value": 519.4979051\n          },\n          {\n            "count": 1,\n            "value": 538.763646\n          }\n        ],\n        "partial_unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18\n        ],\n        "partial_unexpected_list": [\n          418.5040782,\n          424.6241621,\n          461.2111374,\n          463.6467269,\n          452.2835762,\n          492.0884196,\n          519.4979051,\n          409.4192167,\n          397.3081267,\n          500.8308855,\n          356.9288214,\n          478.4097577,\n          504.9095338,\n          510.5411089,\n          450.4983412,\n          515.3896733,\n          538.763646,\n          519.1661847,\n          432.3729603\n        ],\n        "unexpected_count": 19,\n        "unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18\n        ],\n        "unexpected_list": [\n          418.5040782,\n          424.6241621,\n          461.2111374,\n          463.6467269,\n          452.2835762,\n          492.0884196,\n          519.4979051,\n          409.4192167,\n          397.3081267,\n          500.8308855,\n          356.9288214,\n          478.4097577,\n          504.9095338,\n          510.5411089,\n          450.4983412,\n          515.3896733,\n          538.763646,\n          519.1661847,\n          432.3729603\n        ],\n        "unexpected_percent": 100.0,\n        "unexpected_percent_nonmissing": 100.0,\n        "unexpected_percent_total": 100.0\n      },\n      "success": false\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_median_to_be_between",\n        "kwargs": {\n          "batch_id": "b3c90269c91d5315de1e62a6b1406a38",\n          "column": "rotate",\n          "cost": "30",\n          "max_value": 100,\n          "min_value": 0,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "observed_value": 463.6467269\n      },\n      "success": false\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 6,\n    "success_percent": 33.33333333333333,\n    "successful_expectations": 2,\n    "unsuccessful_expectations": 4\n  },\n  "success": false\n}
Suite_17	Validation_17-20220628-104333	20220628T104333.410614Z	b3c90269c91d5315de1e62a6b1406a38	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Device_Telematry_Data - 1K.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "Demo File"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220628T104333.505534Z",\n      "pandas_data_fingerprint": "aea6ab32a8a866baaad0b940f64e1e46"\n    },\n    "batch_spec": {\n      "path": "ge_core/temp/Demo File/Device_Telematry_Data - 1K.csv"\n    },\n    "expectation_suite_name": "Suite_17",\n    "great_expectations_version": "0.15.11",\n    "run_id": {\n      "run_name": "Validation_17-20220628-104333",\n      "run_time": "2022-06-28T10:43:33.410614+00:00"\n    },\n    "validation_time": "20220628T104333.898024Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_of_type",\n        "kwargs": {\n          "batch_id": "b3c90269c91d5315de1e62a6b1406a38",\n          "column": "rotate",\n          "cost": "10",\n          "mostly": 0.8,\n          "type_": "float"\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "observed_value": "float64"\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_increasing",\n        "kwargs": {\n          "batch_id": "b3c90269c91d5315de1e62a6b1406a38",\n          "column": "rotate",\n          "cost": 0,\n          "mostly": 0.2\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 19,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 1,\n            "value": 356.9288214\n          },\n          {\n            "count": 1,\n            "value": 397.3081267\n          },\n          {\n            "count": 1,\n            "value": 409.4192167\n          },\n          {\n            "count": 1,\n            "value": 432.3729603\n          },\n          {\n            "count": 1,\n            "value": 450.4983412\n          },\n          {\n            "count": 1,\n            "value": 452.2835762\n          },\n          {\n            "count": 1,\n            "value": 519.1661847\n          }\n        ],\n        "partial_unexpected_index_list": [\n          4,\n          7,\n          8,\n          10,\n          14,\n          17,\n          18\n        ],\n        "partial_unexpected_list": [\n          452.2835762,\n          409.4192167,\n          397.3081267,\n          356.9288214,\n          450.4983412,\n          519.1661847,\n          432.3729603\n        ],\n        "unexpected_count": 7,\n        "unexpected_index_list": [\n          4,\n          7,\n          8,\n          10,\n          14,\n          17,\n          18\n        ],\n        "unexpected_list": [\n          452.2835762,\n          409.4192167,\n          397.3081267,\n          356.9288214,\n          450.4983412,\n          519.1661847,\n          432.3729603\n        ],\n        "unexpected_percent": 36.84210526315789,\n        "unexpected_percent_nonmissing": 36.84210526315789,\n        "unexpected_percent_total": 36.84210526315789\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_between",\n        "kwargs": {\n          "batch_id": "b3c90269c91d5315de1e62a6b1406a38",\n          "column": "volt",\n          "cost": "10",\n          "max_value": 1000,\n          "min_value": 100,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 19,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 3,\n    "success_percent": 100.0,\n    "successful_expectations": 3,\n    "unsuccessful_expectations": 0\n  },\n  "success": true\n}
Suite_18	Validation_18-20220628-104919	20220628T104919.072722Z	b3c90269c91d5315de1e62a6b1406a38	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Device_Telematry_Data - 1K.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "Demo File"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220628T104919.159870Z",\n      "pandas_data_fingerprint": "aea6ab32a8a866baaad0b940f64e1e46"\n    },\n    "batch_spec": {\n      "path": "ge_core/temp/Demo File/Device_Telematry_Data - 1K.csv"\n    },\n    "expectation_suite_name": "Suite_18",\n    "great_expectations_version": "0.15.11",\n    "run_id": {\n      "run_name": "Validation_18-20220628-104919",\n      "run_time": "2022-06-28T10:49:19.072722+00:00"\n    },\n    "validation_time": "20220628T104919.546356Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_min_to_be_between",\n        "kwargs": {\n          "batch_id": "b3c90269c91d5315de1e62a6b1406a38",\n          "column": "volt",\n          "cost": "10",\n          "max_value": 1000,\n          "min_value": 0,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "observed_value": 136.8785885\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_between",\n        "kwargs": {\n          "batch_id": "b3c90269c91d5315de1e62a6b1406a38",\n          "column": "volt",\n          "cost": 0,\n          "max_value": 1000,\n          "min_value": 0,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 19,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_increasing",\n        "kwargs": {\n          "batch_id": "b3c90269c91d5315de1e62a6b1406a38",\n          "column": "rotate",\n          "cost": 0,\n          "mostly": 0.1\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 19,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 1,\n            "value": 356.9288214\n          },\n          {\n            "count": 1,\n            "value": 397.3081267\n          },\n          {\n            "count": 1,\n            "value": 409.4192167\n          },\n          {\n            "count": 1,\n            "value": 432.3729603\n          },\n          {\n            "count": 1,\n            "value": 450.4983412\n          },\n          {\n            "count": 1,\n            "value": 452.2835762\n          },\n          {\n            "count": 1,\n            "value": 519.1661847\n          }\n        ],\n        "partial_unexpected_index_list": [\n          4,\n          7,\n          8,\n          10,\n          14,\n          17,\n          18\n        ],\n        "partial_unexpected_list": [\n          452.2835762,\n          409.4192167,\n          397.3081267,\n          356.9288214,\n          450.4983412,\n          519.1661847,\n          432.3729603\n        ],\n        "unexpected_count": 7,\n        "unexpected_index_list": [\n          4,\n          7,\n          8,\n          10,\n          14,\n          17,\n          18\n        ],\n        "unexpected_list": [\n          452.2835762,\n          409.4192167,\n          397.3081267,\n          356.9288214,\n          450.4983412,\n          519.1661847,\n          432.3729603\n        ],\n        "unexpected_percent": 36.84210526315789,\n        "unexpected_percent_nonmissing": 36.84210526315789,\n        "unexpected_percent_total": 36.84210526315789\n      },\n      "success": true\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 3,\n    "success_percent": 100.0,\n    "successful_expectations": 3,\n    "unsuccessful_expectations": 0\n  },\n  "success": true\n}
Suite_18	Validation_18-20220628-104945	20220628T104945.132692Z	b3c90269c91d5315de1e62a6b1406a38	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Device_Telematry_Data - 1K.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "Demo File"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220628T104945.219172Z",\n      "pandas_data_fingerprint": "aea6ab32a8a866baaad0b940f64e1e46"\n    },\n    "batch_spec": {\n      "path": "ge_core/temp/Demo File/Device_Telematry_Data - 1K.csv"\n    },\n    "expectation_suite_name": "Suite_18",\n    "great_expectations_version": "0.15.11",\n    "run_id": {\n      "run_name": "Validation_18-20220628-104945",\n      "run_time": "2022-06-28T10:49:45.132692+00:00"\n    },\n    "validation_time": "20220628T104945.643202Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_min_to_be_between",\n        "kwargs": {\n          "batch_id": "b3c90269c91d5315de1e62a6b1406a38",\n          "column": "volt",\n          "cost": "10",\n          "max_value": 1000,\n          "min_value": 0,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "observed_value": 136.8785885\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_between",\n        "kwargs": {\n          "batch_id": "b3c90269c91d5315de1e62a6b1406a38",\n          "column": "volt",\n          "cost": 0,\n          "max_value": 1000,\n          "min_value": 0,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 19,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_increasing",\n        "kwargs": {\n          "batch_id": "b3c90269c91d5315de1e62a6b1406a38",\n          "column": "rotate",\n          "cost": 0,\n          "mostly": 0.1\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 19,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 1,\n            "value": 356.9288214\n          },\n          {\n            "count": 1,\n            "value": 397.3081267\n          },\n          {\n            "count": 1,\n            "value": 409.4192167\n          },\n          {\n            "count": 1,\n            "value": 432.3729603\n          },\n          {\n            "count": 1,\n            "value": 450.4983412\n          },\n          {\n            "count": 1,\n            "value": 452.2835762\n          },\n          {\n            "count": 1,\n            "value": 519.1661847\n          }\n        ],\n        "partial_unexpected_index_list": [\n          4,\n          7,\n          8,\n          10,\n          14,\n          17,\n          18\n        ],\n        "partial_unexpected_list": [\n          452.2835762,\n          409.4192167,\n          397.3081267,\n          356.9288214,\n          450.4983412,\n          519.1661847,\n          432.3729603\n        ],\n        "unexpected_count": 7,\n        "unexpected_index_list": [\n          4,\n          7,\n          8,\n          10,\n          14,\n          17,\n          18\n        ],\n        "unexpected_list": [\n          452.2835762,\n          409.4192167,\n          397.3081267,\n          356.9288214,\n          450.4983412,\n          519.1661847,\n          432.3729603\n        ],\n        "unexpected_percent": 36.84210526315789,\n        "unexpected_percent_nonmissing": 36.84210526315789,\n        "unexpected_percent_total": 36.84210526315789\n      },\n      "success": true\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 3,\n    "success_percent": 100.0,\n    "successful_expectations": 3,\n    "unsuccessful_expectations": 0\n  },\n  "success": true\n}
Suite_16	Validation_16-20220528-103904	20220528T103904.523328Z	b3c90269c91d5315de1e62a6b1406a38	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Device_Telematry_Data - 1K.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "Demo File"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220628T103904.623263Z",\n      "pandas_data_fingerprint": "aea6ab32a8a866baaad0b940f64e1e46"\n    },\n    "batch_spec": {\n      "path": "ge_core/temp/Demo File/Device_Telematry_Data - 1K.csv"\n    },\n    "expectation_suite_name": "Suite_16",\n    "great_expectations_version": "0.15.11",\n    "run_id": {\n      "run_name": "Validation_16-20220628-103904",\n      "run_time": "2022-06-28T10:39:04.523328+00:00"\n    },\n    "validation_time": "20220628T103905.054877Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": "unsupported operand type(s) for -: 'str' and 'str'",\n        "exception_traceback": "Traceback (most recent call last):\\n  File \\"/tmp/8da55c31cbe132c/antenv/lib/python3.9/site-packages/great_expectations/execution_engine/execution_engine.py\\", line 386, in resolve_metrics\\n    resolved_metrics[metric_to_resolve.id] = metric_fn(\\n  File \\"/tmp/8da55c31cbe132c/antenv/lib/python3.9/site-packages/great_expectations/expectations/metrics/metric_provider.py\\", line 55, in inner_func\\n    return metric_fn(*args, **kwargs)\\n  File \\"/tmp/8da55c31cbe132c/antenv/lib/python3.9/site-packages/great_expectations/expectations/metrics/map_metric_provider.py\\", line 331, in inner_func\\n    meets_expectation_series = metric_fn(\\n  File \\"/tmp/8da55c31cbe132c/antenv/lib/python3.9/site-packages/great_expectations/expectations/metrics/column_map_metrics/column_values_increasing.py\\", line 61, in _pandas\\n    series_diff = temp_column.diff()\\n  File \\"/tmp/8da55c31cbe132c/antenv/lib/python3.9/site-packages/pandas/core/series.py\\", line 2697, in diff\\n    result = algorithms.diff(self._values, periods)\\n  File \\"/tmp/8da55c31cbe132c/antenv/lib/python3.9/site-packages/pandas/core/algorithms.py\\", line 1651, in diff\\n    out_arr[res_indexer] = op(arr[res_indexer], arr[lag_indexer])\\nTypeError: unsupported operand type(s) for -: 'str' and 'str'\\n\\nDuring handling of the above exception, another exception occurred:\\n\\nTraceback (most recent call last):\\n  File \\"/tmp/8da55c31cbe132c/antenv/lib/python3.9/site-packages/great_expectations/validator/validator.py\\", line 1287, in resolve_validation_graph\\n    self._resolve_metrics(\\n  File \\"/tmp/8da55c31cbe132c/antenv/lib/python3.9/site-packages/great_expectations/validator/validator.py\\", line 2206, in _resolve_metrics\\n    return execution_engine.resolve_metrics(\\n  File \\"/tmp/8da55c31cbe132c/antenv/lib/python3.9/site-packages/great_expectations/execution_engine/execution_engine.py\\", line 390, in resolve_metrics\\n    raise ge_exceptions.MetricResolutionError(\\ngreat_expectations.exceptions.exceptions.MetricResolutionError: unsupported operand type(s) for -: 'str' and 'str'\\n",\n        "raised_exception": true\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_increasing",\n        "kwargs": {\n          "batch_id": "b3c90269c91d5315de1e62a6b1406a38",\n          "column": "timestamp",\n          "cost": 0,\n          "mostly": 0.1\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {},\n      "success": false\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_between",\n        "kwargs": {\n          "batch_id": "b3c90269c91d5315de1e62a6b1406a38",\n          "column": "volt",\n          "cost": 0,\n          "max_value": 1000,\n          "min_value": 100,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 19,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 2,\n    "success_percent": 50.0,\n    "successful_expectations": 1,\n    "unsuccessful_expectations": 1\n  },\n  "success": false\n}
Demo_10000	Validation_1000-20220629-150152	20220629T150152.045278Z	b3c90269c91d5315de1e62a6b1406a38	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Device_Telematry_Data - 1K.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "Demo File"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220629T150152.163146Z",\n      "pandas_data_fingerprint": "aea6ab32a8a866baaad0b940f64e1e46"\n    },\n    "batch_spec": {\n      "path": "ge_core/temp/Demo File/Device_Telematry_Data - 1K.csv"\n    },\n    "expectation_suite_name": "Demo_10000",\n    "great_expectations_version": "0.15.11",\n    "run_id": {\n      "run_name": "Validation_1000-20220629-150152",\n      "run_time": "2022-06-29T15:01:52.045278+00:00"\n    },\n    "validation_time": "20220629T150152.668917Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_not_be_null",\n        "kwargs": {\n          "batch_id": "b3c90269c91d5315de1e62a6b1406a38",\n          "column": "device_id",\n          "cost": "10",\n          "mostly": 1\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 19,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_unique",\n        "kwargs": {\n          "batch_id": "b3c90269c91d5315de1e62a6b1406a38",\n          "column": "timestamp",\n          "cost": 0,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 19,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 10,\n            "value": "01-01-21 6:00"\n          },\n          {\n            "count": 9,\n            "value": "01-01-21 7:00"\n          }\n        ],\n        "partial_unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18\n        ],\n        "partial_unexpected_list": [\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 7:00",\n          "01-01-21 7:00",\n          "01-01-21 7:00",\n          "01-01-21 7:00",\n          "01-01-21 7:00",\n          "01-01-21 7:00",\n          "01-01-21 7:00",\n          "01-01-21 7:00",\n          "01-01-21 7:00"\n        ],\n        "unexpected_count": 19,\n        "unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18\n        ],\n        "unexpected_list": [\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 6:00",\n          "01-01-21 7:00",\n          "01-01-21 7:00",\n          "01-01-21 7:00",\n          "01-01-21 7:00",\n          "01-01-21 7:00",\n          "01-01-21 7:00",\n          "01-01-21 7:00",\n          "01-01-21 7:00",\n          "01-01-21 7:00"\n        ],\n        "unexpected_percent": 100.0,\n        "unexpected_percent_nonmissing": 100.0,\n        "unexpected_percent_total": 100.0\n      },\n      "success": false\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 2,\n    "success_percent": 50.0,\n    "successful_expectations": 1,\n    "unsuccessful_expectations": 1\n  },\n  "success": false\n}
Suite_14	Validation_14-20220428-095401	20220428T095401.891893Z	b3c90269c91d5315de1e62a6b1406a38	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Device_Telematry_Data - 1K.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "Demo File"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220628T095401.966560Z",\n      "pandas_data_fingerprint": "aea6ab32a8a866baaad0b940f64e1e46"\n    },\n    "batch_spec": {\n      "path": "ge_core/temp/Demo File/Device_Telematry_Data - 1K.csv"\n    },\n    "expectation_suite_name": "Suite_14",\n    "great_expectations_version": "0.15.11",\n    "run_id": {\n      "run_name": "Validation_14-20220628-095401",\n      "run_time": "2022-06-28T09:54:01.891893+00:00"\n    },\n    "validation_time": "20220628T095402.421883Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_of_type",\n        "kwargs": {\n          "batch_id": "b3c90269c91d5315de1e62a6b1406a38",\n          "column": "pressure",\n          "cost": "10",\n          "mostly": 0.8,\n          "type_": "float"\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "observed_value": "float64"\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_not_be_null",\n        "kwargs": {\n          "batch_id": "b3c90269c91d5315de1e62a6b1406a38",\n          "column": "device_id",\n          "cost": "20",\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 19,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_unique",\n        "kwargs": {\n          "batch_id": "b3c90269c91d5315de1e62a6b1406a38",\n          "column": "ip_address",\n          "cost": "20",\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 19,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 2,\n            "value": "10.91.103.94"\n          },\n          {\n            "count": 2,\n            "value": "2.91.103.80"\n          },\n          {\n            "count": 2,\n            "value": "20.101.103.7"\n          },\n          {\n            "count": 2,\n            "value": "34.102.103.6"\n          },\n          {\n            "count": 2,\n            "value": "34.91.103.95"\n          },\n          {\n            "count": 2,\n            "value": "34.91.105.99"\n          },\n          {\n            "count": 2,\n            "value": "37.10.103.60"\n          },\n          {\n            "count": 2,\n            "value": "6.91.103.90"\n          },\n          {\n            "count": 2,\n            "value": "7.91.103.21"\n          }\n        ],\n        "partial_unexpected_index_list": [\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18\n        ],\n        "partial_unexpected_list": [\n          "10.91.103.94",\n          "34.91.103.95",\n          "6.91.103.90",\n          "2.91.103.80",\n          "7.91.103.21",\n          "34.102.103.6",\n          "20.101.103.7",\n          "34.91.105.99",\n          "37.10.103.60",\n          "37.10.103.60",\n          "34.91.105.99",\n          "20.101.103.7",\n          "34.102.103.6",\n          "7.91.103.21",\n          "2.91.103.80",\n          "6.91.103.90",\n          "34.91.103.95",\n          "10.91.103.94"\n        ],\n        "unexpected_count": 18,\n        "unexpected_index_list": [\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18\n        ],\n        "unexpected_list": [\n          "10.91.103.94",\n          "34.91.103.95",\n          "6.91.103.90",\n          "2.91.103.80",\n          "7.91.103.21",\n          "34.102.103.6",\n          "20.101.103.7",\n          "34.91.105.99",\n          "37.10.103.60",\n          "37.10.103.60",\n          "34.91.105.99",\n          "20.101.103.7",\n          "34.102.103.6",\n          "7.91.103.21",\n          "2.91.103.80",\n          "6.91.103.90",\n          "34.91.103.95",\n          "10.91.103.94"\n        ],\n        "unexpected_percent": 94.73684210526315,\n        "unexpected_percent_nonmissing": 94.73684210526315,\n        "unexpected_percent_total": 94.73684210526315\n      },\n      "success": false\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_increasing",\n        "kwargs": {\n          "batch_id": "b3c90269c91d5315de1e62a6b1406a38",\n          "column": "rotate",\n          "cost": "30",\n          "mostly": 0.2\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 19,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 1,\n            "value": 356.9288214\n          },\n          {\n            "count": 1,\n            "value": 397.3081267\n          },\n          {\n            "count": 1,\n            "value": 409.4192167\n          },\n          {\n            "count": 1,\n            "value": 432.3729603\n          },\n          {\n            "count": 1,\n            "value": 450.4983412\n          },\n          {\n            "count": 1,\n            "value": 452.2835762\n          },\n          {\n            "count": 1,\n            "value": 519.1661847\n          }\n        ],\n        "partial_unexpected_index_list": [\n          4,\n          7,\n          8,\n          10,\n          14,\n          17,\n          18\n        ],\n        "partial_unexpected_list": [\n          452.2835762,\n          409.4192167,\n          397.3081267,\n          356.9288214,\n          450.4983412,\n          519.1661847,\n          432.3729603\n        ],\n        "unexpected_count": 7,\n        "unexpected_index_list": [\n          4,\n          7,\n          8,\n          10,\n          14,\n          17,\n          18\n        ],\n        "unexpected_list": [\n          452.2835762,\n          409.4192167,\n          397.3081267,\n          356.9288214,\n          450.4983412,\n          519.1661847,\n          432.3729603\n        ],\n        "unexpected_percent": 36.84210526315789,\n        "unexpected_percent_nonmissing": 36.84210526315789,\n        "unexpected_percent_total": 36.84210526315789\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_between",\n        "kwargs": {\n          "batch_id": "b3c90269c91d5315de1e62a6b1406a38",\n          "column": "volt",\n          "cost": "20",\n          "max_value": 500,\n          "min_value": 100,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 19,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_min_to_be_between",\n        "kwargs": {\n          "batch_id": "b3c90269c91d5315de1e62a6b1406a38",\n          "column": "volt",\n          "cost": "30",\n          "max_value": 200,\n          "min_value": 100,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "observed_value": 136.8785885\n      },\n      "success": true\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 6,\n    "success_percent": 83.33333333333334,\n    "successful_expectations": 5,\n    "unsuccessful_expectations": 1\n  },\n  "success": false\n}
suite_2	checkpoint_1-20220704-072029	20220704T072029.450437Z	5cc261183f174463f79c5e6acd5915a5	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Customer_OrderData.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "local"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220704T072030.771474Z",\n      "pandas_data_fingerprint": "8c01a7f129832be7e2c611cbc5c25ba0"\n    },\n    "batch_spec": {\n      "path": "ge_core\\\\temp\\\\local\\\\Customer_OrderData.csv"\n    },\n    "expectation_suite_name": "suite_2",\n    "great_expectations_version": "0.15.12",\n    "run_id": {\n      "run_name": "checkpoint_1-20220704-072029",\n      "run_time": "2022-07-04T07:20:29.450437+00:00"\n    },\n    "validation_time": "20220704T072030.850475Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_of_type",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Name",\n          "cost": 0,\n          "mostly": 0.8,\n          "type_": "str"\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_unique",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Email Address",\n          "cost": "10",\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_between",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Unit Cost",\n          "cost": "10",\n          "max_value": 1000000,\n          "min_value": 10000,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [\n          {\n            "count": 17,\n            "value": 263.33\n          },\n          {\n            "count": 14,\n            "value": 6.92\n          },\n          {\n            "count": 12,\n            "value": 31.79\n          },\n          {\n            "count": 12,\n            "value": 502.54\n          },\n          {\n            "count": 11,\n            "value": 35.84\n          },\n          {\n            "count": 10,\n            "value": 117.11\n          },\n          {\n            "count": 9,\n            "value": 56.67\n          },\n          {\n            "count": 9,\n            "value": 159.42\n          },\n          {\n            "count": 9,\n            "value": 364.69\n          },\n          {\n            "count": 9,\n            "value": 524.96\n          },\n          {\n            "count": 5,\n            "value": 97.44\n          },\n          {\n            "count": 3,\n            "value": 90.93\n          }\n        ],\n        "partial_unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19\n        ],\n        "partial_unexpected_list": [\n          6.92,\n          35.84,\n          364.69,\n          35.84,\n          31.79,\n          6.92,\n          31.79,\n          31.79,\n          524.96,\n          263.33,\n          6.92,\n          263.33,\n          97.44,\n          35.84,\n          56.67,\n          56.67,\n          524.96,\n          263.33,\n          263.33,\n          56.67\n        ],\n        "unexpected_count": 120,\n        "unexpected_index_list": [\n          0,\n          1,\n          2,\n          3,\n          4,\n          5,\n          6,\n          7,\n          8,\n          9,\n          10,\n          11,\n          12,\n          13,\n          14,\n          15,\n          16,\n          17,\n          18,\n          19,\n          20,\n          21,\n          22,\n          23,\n          24,\n          25,\n          26,\n          27,\n          28,\n          29,\n          30,\n          31,\n          32,\n          33,\n          34,\n          35,\n          36,\n          37,\n          38,\n          39,\n          40,\n          41,\n          42,\n          43,\n          44,\n          45,\n          46,\n          47,\n          48,\n          49,\n          50,\n          51,\n          52,\n          53,\n          54,\n          55,\n          56,\n          57,\n          58,\n          59,\n          60,\n          61,\n          62,\n          63,\n          64,\n          65,\n          66,\n          67,\n          68,\n          69,\n          70,\n          71,\n          72,\n          73,\n          74,\n          75,\n          76,\n          77,\n          78,\n          79,\n          80,\n          81,\n          82,\n          83,\n          84,\n          85,\n          86,\n          87,\n          88,\n          89,\n          90,\n          91,\n          92,\n          93,\n          94,\n          95,\n          96,\n          97,\n          98,\n          99,\n          100,\n          101,\n          102,\n          103,\n          104,\n          105,\n          106,\n          107,\n          108,\n          109,\n          110,\n          111,\n          112,\n          113,\n          114,\n          115,\n          116,\n          117,\n          118,\n          119\n        ],\n        "unexpected_list": [\n          6.92,\n          35.84,\n          364.69,\n          35.84,\n          31.79,\n          6.92,\n          31.79,\n          31.79,\n          524.96,\n          263.33,\n          6.92,\n          263.33,\n          97.44,\n          35.84,\n          56.67,\n          56.67,\n          524.96,\n          263.33,\n          263.33,\n          56.67,\n          524.96,\n          502.54,\n          90.93,\n          263.33,\n          159.42,\n          524.96,\n          263.33,\n          502.54,\n          524.96,\n          502.54,\n          31.79,\n          6.92,\n          97.44,\n          502.54,\n          97.44,\n          263.33,\n          56.67,\n          502.54,\n          263.33,\n          502.54,\n          35.84,\n          35.84,\n          117.11,\n          31.79,\n          502.54,\n          263.33,\n          35.84,\n          263.33,\n          364.69,\n          6.92,\n          364.69,\n          502.54,\n          524.96,\n          263.33,\n          364.69,\n          364.69,\n          35.84,\n          117.11,\n          31.79,\n          117.11,\n          56.67,\n          6.92,\n          117.11,\n          524.96,\n          6.92,\n          31.79,\n          117.11,\n          31.79,\n          159.42,\n          90.93,\n          6.92,\n          502.54,\n          31.79,\n          56.67,\n          35.84,\n          159.42,\n          6.92,\n          31.79,\n          35.84,\n          117.11,\n          6.92,\n          502.54,\n          56.67,\n          159.42,\n          6.92,\n          159.42,\n          524.96,\n          6.92,\n          6.92,\n          117.11,\n          364.69,\n          35.84,\n          56.67,\n          263.33,\n          31.79,\n          159.42,\n          364.69,\n          364.69,\n          117.11,\n          159.42,\n          263.33,\n          6.92,\n          117.11,\n          159.42,\n          97.44,\n          502.54,\n          263.33,\n          90.93,\n          502.54,\n          159.42,\n          56.67,\n          263.33,\n          31.79,\n          524.96,\n          364.69,\n          35.84,\n          97.44,\n          117.11,\n          263.33,\n          263.33\n        ],\n        "unexpected_percent": 100.0,\n        "unexpected_percent_nonmissing": 100.0,\n        "unexpected_percent_total": 100.0\n      },\n      "success": false\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 3,\n    "success_percent": 66.66666666666666,\n    "successful_expectations": 2,\n    "unsuccessful_expectations": 1\n  },\n  "success": false\n}
DEmo	DEmo-20220704-072524	20220704T072524.864848Z	5cc261183f174463f79c5e6acd5915a5	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Customer_OrderData.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "local"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220704T072526.195984Z",\n      "pandas_data_fingerprint": "8c01a7f129832be7e2c611cbc5c25ba0"\n    },\n    "batch_spec": {\n      "path": "ge_core\\\\temp\\\\local\\\\Customer_OrderData.csv"\n    },\n    "expectation_suite_name": "DEmo",\n    "great_expectations_version": "0.15.12",\n    "run_id": {\n      "run_name": "DEmo-20220704-072524",\n      "run_time": "2022-07-04T07:25:24.864848+00:00"\n    },\n    "validation_time": "20220704T072526.264988Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": "Unrecognized numpy/python type: type",\n        "exception_traceback": "Traceback (most recent call last):\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\execution_engine\\\\execution_engine.py\\", line 385, in resolve_metrics\\n    resolved_metrics[metric_to_resolve.id] = metric_fn(\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\expectations\\\\metrics\\\\metric_provider.py\\", line 55, in inner_func\\n    return metric_fn(*args, **kwargs)\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\expectations\\\\metrics\\\\map_metric_provider.py\\", line 331, in inner_func\\n    meets_expectation_series = metric_fn(\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\expectations\\\\metrics\\\\column_map_metrics\\\\column_values_of_type.py\\", line 43, in _pandas\\n    raise ValueError(f\\"Unrecognized numpy/python type: {type_}\\")\\nValueError: Unrecognized numpy/python type: type\\n\\nDuring handling of the above exception, another exception occurred:\\n\\nTraceback (most recent call last):\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\validator\\\\validator.py\\", line 1287, in resolve_validation_graph\\n    self._resolve_metrics(\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\validator\\\\validator.py\\", line 2204, in _resolve_metrics\\n    return execution_engine.resolve_metrics(\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\execution_engine\\\\execution_engine.py\\", line 389, in resolve_metrics\\n    raise ge_exceptions.MetricResolutionError(\\ngreat_expectations.exceptions.exceptions.MetricResolutionError: Unrecognized numpy/python type: type\\n",\n        "raised_exception": true\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_of_type",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Name",\n          "cost": 0,\n          "mostly": 0.8,\n          "type_": "type"\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {},\n      "success": false\n    },\n    {\n      "exception_info": {\n        "exception_message": "Unrecognized numpy/python type: type",\n        "exception_traceback": "Traceback (most recent call last):\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\execution_engine\\\\execution_engine.py\\", line 385, in resolve_metrics\\n    resolved_metrics[metric_to_resolve.id] = metric_fn(\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\expectations\\\\metrics\\\\metric_provider.py\\", line 55, in inner_func\\n    return metric_fn(*args, **kwargs)\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\expectations\\\\metrics\\\\map_metric_provider.py\\", line 331, in inner_func\\n    meets_expectation_series = metric_fn(\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\expectations\\\\metrics\\\\column_map_metrics\\\\column_values_of_type.py\\", line 43, in _pandas\\n    raise ValueError(f\\"Unrecognized numpy/python type: {type_}\\")\\nValueError: Unrecognized numpy/python type: type\\n\\nDuring handling of the above exception, another exception occurred:\\n\\nTraceback (most recent call last):\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\validator\\\\validator.py\\", line 1287, in resolve_validation_graph\\n    self._resolve_metrics(\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\validator\\\\validator.py\\", line 2204, in _resolve_metrics\\n    return execution_engine.resolve_metrics(\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\execution_engine\\\\execution_engine.py\\", line 389, in resolve_metrics\\n    raise ge_exceptions.MetricResolutionError(\\ngreat_expectations.exceptions.exceptions.MetricResolutionError: Unrecognized numpy/python type: type\\n",\n        "raised_exception": true\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_of_type",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Address ",\n          "cost": 0,\n          "mostly": 0.8,\n          "type_": "type"\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {},\n      "success": false\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 2,\n    "success_percent": 0.0,\n    "successful_expectations": 0,\n    "unsuccessful_expectations": 2\n  },\n  "success": false\n}
suite_7	DEmo-20220704-073033	20220704T073033.722216Z	c4117383971fe9d6a0cc75a492d8c643	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "public.auth_user",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "DB"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220704T073035.055708Z"\n    },\n    "batch_spec": {\n      "batch_identifiers": {},\n      "data_asset_name": "public.auth_user",\n      "schema_name": "public",\n      "table_name": "auth_user",\n      "type": "table"\n    },\n    "expectation_suite_name": "suite_7",\n    "great_expectations_version": "0.15.12",\n    "run_id": {\n      "run_name": "DEmo-20220704-073033",\n      "run_time": "2022-07-04T07:30:33.722216+00:00"\n    },\n    "validation_time": "20220704T073035.264501Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": "No provider found for column_values.increasing.unexpected_count using SqlAlchemyExecutionEngine",\n        "exception_traceback": "Traceback (most recent call last):\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\expectations\\\\registry.py\\", line 188, in get_metric_provider\\n    return metric_definition[\\"providers\\"][type(execution_engine).__name__]\\nKeyError: 'SqlAlchemyExecutionEngine'\\n\\nDuring handling of the above exception, another exception occurred:\\n\\nTraceback (most recent call last):\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\validator\\\\validator.py\\", line 1039, in _generate_metric_dependency_subgraphs_for_each_expectation_configuration\\n    self.build_metric_dependency_graph(\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\validator\\\\validator.py\\", line 1179, in build_metric_dependency_graph\\n    metric_impl = get_metric_provider(\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\expectations\\\\registry.py\\", line 190, in get_metric_provider\\n    raise ge_exceptions.MetricProviderError(\\ngreat_expectations.exceptions.exceptions.MetricProviderError: No provider found for column_values.increasing.unexpected_count using SqlAlchemyExecutionEngine\\n",\n        "raised_exception": true\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_increasing",\n        "kwargs": {\n          "batch_id": "c4117383971fe9d6a0cc75a492d8c643",\n          "column": "uv",\n          "cost": 0,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {},\n      "success": false\n    },\n    {\n      "exception_info": {\n        "exception_message": "Error: The column \\"rotate\\" in BatchData does not exist.",\n        "exception_traceback": "Traceback (most recent call last):\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\execution_engine\\\\execution_engine.py\\", line 385, in resolve_metrics\\n    resolved_metrics[metric_to_resolve.id] = metric_fn(\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\expectations\\\\metrics\\\\metric_provider.py\\", line 55, in inner_func\\n    return metric_fn(*args, **kwargs)\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\expectations\\\\metrics\\\\map_metric_provider.py\\", line 386, in inner_func\\n    raise ge_exceptions.InvalidMetricAccessorDomainKwargsKeyError(\\ngreat_expectations.exceptions.exceptions.InvalidMetricAccessorDomainKwargsKeyError: Error: The column \\"rotate\\" in BatchData does not exist.\\n\\nDuring handling of the above exception, another exception occurred:\\n\\nTraceback (most recent call last):\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\validator\\\\validator.py\\", line 1287, in resolve_validation_graph\\n    self._resolve_metrics(\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\validator\\\\validator.py\\", line 2204, in _resolve_metrics\\n    return execution_engine.resolve_metrics(\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\execution_engine\\\\execution_engine.py\\", line 389, in resolve_metrics\\n    raise ge_exceptions.MetricResolutionError(\\ngreat_expectations.exceptions.exceptions.MetricResolutionError: Error: The column \\"rotate\\" in BatchData does not exist.\\n",\n        "raised_exception": true\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_unique",\n        "kwargs": {\n          "batch_id": "c4117383971fe9d6a0cc75a492d8c643",\n          "column": "rotate",\n          "cost": 0,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {},\n      "success": false\n    },\n    {\n      "exception_info": {\n        "exception_message": "Error: The column \\"volt\\" in BatchData does not exist.",\n        "exception_traceback": "Traceback (most recent call last):\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\execution_engine\\\\execution_engine.py\\", line 385, in resolve_metrics\\n    resolved_metrics[metric_to_resolve.id] = metric_fn(\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\expectations\\\\metrics\\\\metric_provider.py\\", line 55, in inner_func\\n    return metric_fn(*args, **kwargs)\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\expectations\\\\metrics\\\\map_metric_provider.py\\", line 386, in inner_func\\n    raise ge_exceptions.InvalidMetricAccessorDomainKwargsKeyError(\\ngreat_expectations.exceptions.exceptions.InvalidMetricAccessorDomainKwargsKeyError: Error: The column \\"volt\\" in BatchData does not exist.\\n\\nDuring handling of the above exception, another exception occurred:\\n\\nTraceback (most recent call last):\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\validator\\\\validator.py\\", line 1287, in resolve_validation_graph\\n    self._resolve_metrics(\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\validator\\\\validator.py\\", line 2204, in _resolve_metrics\\n    return execution_engine.resolve_metrics(\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\execution_engine\\\\execution_engine.py\\", line 389, in resolve_metrics\\n    raise ge_exceptions.MetricResolutionError(\\ngreat_expectations.exceptions.exceptions.MetricResolutionError: Error: The column \\"volt\\" in BatchData does not exist.\\n",\n        "raised_exception": true\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_between",\n        "kwargs": {\n          "batch_id": "c4117383971fe9d6a0cc75a492d8c643",\n          "column": "volt",\n          "cost": 0,\n          "max_value": 400,\n          "min_value": 100,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {},\n      "success": false\n    },\n    {\n      "exception_info": {\n        "exception_message": "list index out of range",\n        "exception_traceback": "Traceback (most recent call last):\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\validator\\\\validator.py\\", line 979, in graph_validate\\n    result = configuration.metrics_validate(\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\core\\\\expectation_configuration.py\\", line 1371, in metrics_validate\\n    return expectation_impl(self).metrics_validate(\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\expectations\\\\expectation.py\\", line 709, in metrics_validate\\n    ] = self._validate(\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\expectations\\\\core\\\\expect_column_values_to_be_of_type.py\\", line 522, in _validate\\n    actual_column_type = [\\nIndexError: list index out of range\\n",\n        "raised_exception": true\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_of_type",\n        "kwargs": {\n          "batch_id": "c4117383971fe9d6a0cc75a492d8c643",\n          "column": "temperature",\n          "cost": 0,\n          "mostly": 0.8,\n          "type_": "int"\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {},\n      "success": false\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 4,\n    "success_percent": 0.0,\n    "successful_expectations": 0,\n    "unsuccessful_expectations": 4\n  },\n  "success": false\n}
DEMO1	DEmo-20220704-080231	20220704T080231.656187Z	134b56d441ef28aaaa02d9679ab566a0	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "telemetry_hourly_change.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "De"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220704T080232.986857Z",\n      "pandas_data_fingerprint": "833f6b896148c63668f87be30868dbfd"\n    },\n    "batch_spec": {\n      "path": "ge_core\\\\temp\\\\De\\\\telemetry_hourly_change.csv"\n    },\n    "expectation_suite_name": "DEMO1",\n    "great_expectations_version": "0.15.12",\n    "run_id": {\n      "run_name": "DEmo-20220704-080231",\n      "run_time": "2022-07-04T08:02:31.656187+00:00"\n    },\n    "validation_time": "20220704T080233.050860Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": "Unrecognized numpy/python type: type",\n        "exception_traceback": "Traceback (most recent call last):\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\execution_engine\\\\execution_engine.py\\", line 385, in resolve_metrics\\n    resolved_metrics[metric_to_resolve.id] = metric_fn(\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\expectations\\\\metrics\\\\metric_provider.py\\", line 55, in inner_func\\n    return metric_fn(*args, **kwargs)\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\expectations\\\\metrics\\\\map_metric_provider.py\\", line 331, in inner_func\\n    meets_expectation_series = metric_fn(\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\expectations\\\\metrics\\\\column_map_metrics\\\\column_values_of_type.py\\", line 43, in _pandas\\n    raise ValueError(f\\"Unrecognized numpy/python type: {type_}\\")\\nValueError: Unrecognized numpy/python type: type\\n\\nDuring handling of the above exception, another exception occurred:\\n\\nTraceback (most recent call last):\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\validator\\\\validator.py\\", line 1287, in resolve_validation_graph\\n    self._resolve_metrics(\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\validator\\\\validator.py\\", line 2204, in _resolve_metrics\\n    return execution_engine.resolve_metrics(\\n  File \\"C:\\\\Users\\\\umesh\\\\Downloads\\\\gDQC\\\\venv\\\\lib\\\\site-packages\\\\great_expectations\\\\execution_engine\\\\execution_engine.py\\", line 389, in resolve_metrics\\n    raise ge_exceptions.MetricResolutionError(\\ngreat_expectations.exceptions.exceptions.MetricResolutionError: Unrecognized numpy/python type: type\\n",\n        "raised_exception": true\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_of_type",\n        "kwargs": {\n          "batch_id": "134b56d441ef28aaaa02d9679ab566a0",\n          "column": "timestamp",\n          "cost": 0,\n          "mostly": 0.8,\n          "type_": "type"\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {},\n      "success": false\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_table_columns_to_match_ordered_list",\n        "kwargs": {\n          "batch_id": "134b56d441ef28aaaa02d9679ab566a0",\n          "column": "timestamp",\n          "column_list": [\n            "column_list"\n          ],\n          "cost": 0,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "details": {\n          "mismatched": [\n            {\n              "Expected": "column_list",\n              "Expected Column Position": 0,\n              "Found": "timestamp"\n            },\n            {\n              "Expected": null,\n              "Expected Column Position": 1,\n              "Found": "uv"\n            },\n            {\n              "Expected": null,\n              "Expected Column Position": 2,\n              "Found": "temperature"\n            },\n            {\n              "Expected": null,\n              "Expected Column Position": 3,\n              "Found": "humidity"\n            },\n            {\n              "Expected": null,\n              "Expected Column Position": 4,\n              "Found": "volt"\n            },\n            {\n              "Expected": null,\n              "Expected Column Position": 5,\n              "Found": "rotate"\n            },\n            {\n              "Expected": null,\n              "Expected Column Position": 6,\n              "Found": "pressure"\n            },\n            {\n              "Expected": null,\n              "Expected Column Position": 7,\n              "Found": "vibration"\n            }\n          ]\n        },\n        "observed_value": [\n          "timestamp",\n          "uv",\n          "temperature",\n          "humidity",\n          "volt",\n          "rotate",\n          "pressure",\n          "vibration"\n        ]\n      },\n      "success": false\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 2,\n    "success_percent": 0.0,\n    "successful_expectations": 0,\n    "unsuccessful_expectations": 2\n  },\n  "success": false\n}
Demo11	DEmo11-20220704-082138	20220704T082138.221510Z	ef88d3180d3bdb48c4ae3728585294b7	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Device_Telemetry_Daily.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "local"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220704T082139.554907Z",\n      "pandas_data_fingerprint": "815e1c837f7aec3597b512dfd9ef99e9"\n    },\n    "batch_spec": {\n      "path": "ge_core\\\\temp\\\\local\\\\Device_Telemetry_Daily.csv"\n    },\n    "expectation_suite_name": "Demo11",\n    "great_expectations_version": "0.15.12",\n    "run_id": {\n      "run_name": "DEmo11-20220704-082138",\n      "run_time": "2022-07-04T08:21:38.221510+00:00"\n    },\n    "validation_time": "20220704T082139.616907Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_of_type",\n        "kwargs": {\n          "batch_id": "ef88d3180d3bdb48c4ae3728585294b7",\n          "column": "vibration",\n          "cost": 0,\n          "mostly": 0.8,\n          "type_": "type"\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "observed_value": "float64"\n      },\n      "success": false\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 1,\n    "success_percent": 0.0,\n    "successful_expectations": 0,\n    "unsuccessful_expectations": 1\n  },\n  "success": false\n}
sample_suite	SAMPLE_RUN-20220704-110905	20220704T110905.699164Z	5cc261183f174463f79c5e6acd5915a5	{\n  "evaluation_parameters": {},\n  "meta": {\n    "active_batch_definition": {\n      "batch_identifiers": {},\n      "data_asset_name": "Customer_OrderData.csv",\n      "data_connector_name": "default_inferred_data_connector_name",\n      "datasource_name": "local"\n    },\n    "batch_markers": {\n      "ge_load_time": "20220704T110907.045188Z",\n      "pandas_data_fingerprint": "8c01a7f129832be7e2c611cbc5c25ba0"\n    },\n    "batch_spec": {\n      "path": "ge_core\\\\temp\\\\local\\\\Customer_OrderData.csv"\n    },\n    "expectation_suite_name": "sample_suite",\n    "great_expectations_version": "0.15.7",\n    "run_id": {\n      "run_name": "SAMPLE_RUN-20220704-110905",\n      "run_time": "2022-07-04T11:09:05.699164+00:00"\n    },\n    "validation_time": "20220704T110907.123189Z"\n  },\n  "results": [\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_be_of_type",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Name",\n          "cost": 0,\n          "mostly": 0.8,\n          "type_": "str"\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "missing_count": 0,\n        "missing_percent": 0.0,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0,\n        "unexpected_percent_nonmissing": 0.0,\n        "unexpected_percent_total": 0.0\n      },\n      "success": true\n    },\n    {\n      "exception_info": {\n        "exception_message": null,\n        "exception_traceback": null,\n        "raised_exception": false\n      },\n      "expectation_config": {\n        "expectation_type": "expect_column_values_to_not_be_null",\n        "kwargs": {\n          "batch_id": "5cc261183f174463f79c5e6acd5915a5",\n          "column": "Unit Cost",\n          "cost": 0,\n          "mostly": 0.8\n        },\n        "meta": {}\n      },\n      "meta": {},\n      "result": {\n        "element_count": 120,\n        "partial_unexpected_counts": [],\n        "partial_unexpected_index_list": [],\n        "partial_unexpected_list": [],\n        "unexpected_count": 0,\n        "unexpected_index_list": [],\n        "unexpected_list": [],\n        "unexpected_percent": 0.0\n      },\n      "success": true\n    }\n  ],\n  "statistics": {\n    "evaluated_expectations": 2,\n    "success_percent": 100.0,\n    "successful_expectations": 2,\n    "unsuccessful_expectations": 0\n  },\n  "success": true\n}
\.


--
-- Data for Name: stream_checkpoints; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.stream_checkpoints (checkpoint_name, datasource_name, expectation_suite_name, status) FROM stdin;
\.


--
-- Data for Name: stream_validations_store; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.stream_validations_store (checkpoint_name, element_count, unexpected_count, value) FROM stdin;
\.


--
-- Data for Name: wizard_flow_data; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.wizard_flow_data (id, status, current_page, datasource_name, data_assets, asset_for_profile, all_columns, selected_ce, expectation_suite_name, suite_config, run_name) FROM stdin;
1	in-progress	profiling	local	{"list":["Customer_OrderData.csv"]}	Customer_OrderData.csv	{"list":[{"column":"Name","dtype":null},{"column":"Email Address","dtype":null},{"column":"Address ","dtype":null},{"column":"Country","dtype":null},{"column":"Job Title","dtype":null},{"column":"Phone Number","dtype":null},{"column":"Item Type","dtype":null},{"column":"Sales Channel","dtype":null},{"column":"Order Priority","dtype":null},{"column":"Order Date","dtype":null},{"column":"Order ID","dtype":null},{"column":"Ship Date","dtype":null},{"column":"Extra ","dtype":null},{"column":"Aggregate","dtype":null},{"column":"Billing Date","dtype":null},{"column":"Units Sold","dtype":null},{"column":"Unit Price","dtype":null},{"column":"Unit Cost","dtype":null},{"column":"Total Revenue","dtype":null},{"column":"Total Cost","dtype":null},{"column":"Total Profit","dtype":null}]}	\N	\N	\N	\N
\.


--
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.auth_group_id_seq', 1, false);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.auth_group_permissions_id_seq', 1, false);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.auth_permission_id_seq', 92, true);


--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.auth_user_groups_id_seq', 1, false);


--
-- Name: auth_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.auth_user_id_seq', 1, false);


--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.auth_user_user_permissions_id_seq', 1, false);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.django_admin_log_id_seq', 1, false);


--
-- Name: django_celery_beat_clockedschedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.django_celery_beat_clockedschedule_id_seq', 1, false);


--
-- Name: django_celery_beat_crontabschedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.django_celery_beat_crontabschedule_id_seq', 1, false);


--
-- Name: django_celery_beat_intervalschedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.django_celery_beat_intervalschedule_id_seq', 1, false);


--
-- Name: django_celery_beat_periodictask_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.django_celery_beat_periodictask_id_seq', 1, false);


--
-- Name: django_celery_beat_solarschedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.django_celery_beat_solarschedule_id_seq', 1, false);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.django_content_type_id_seq', 23, true);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.django_migrations_id_seq', 45, true);


--
-- Name: ge_api_cde_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.ge_api_cde_id_seq', 1, false);


--
-- Name: ge_api_dataprofile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.ge_api_dataprofile_id_seq', 1, false);


--
-- Name: ge_api_datasource_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.ge_api_datasource_id_seq', 1, false);


--
-- Name: ge_api_dqdimension_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.ge_api_dqdimension_id_seq', 1, false);


--
-- Name: ge_api_execution_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.ge_api_execution_id_seq', 1, false);


--
-- Name: ge_api_project_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.ge_api_project_id_seq', 1, false);


--
-- Name: ge_api_report_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.ge_api_report_id_seq', 15, true);


--
-- Name: ge_api_result_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.ge_api_result_id_seq', 1, false);


--
-- Name: ge_api_resultv1_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.ge_api_resultv1_id_seq', 123, true);


--
-- Name: ge_api_rule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.ge_api_rule_id_seq', 1, false);


--
-- Name: ge_api_rulemodel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.ge_api_rulemodel_id_seq', 1, false);


--
-- Name: wizard_flow_data_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.wizard_flow_data_id_seq', 1, true);


--
-- Name: auth_group auth_group_name_key; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);


--
-- Name: auth_group_permissions auth_group_permissions_group_id_permission_id_0cd325b0_uniq; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_permission_id_0cd325b0_uniq UNIQUE (group_id, permission_id);


--
-- Name: auth_group_permissions auth_group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_group auth_group_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);


--
-- Name: auth_permission auth_permission_content_type_id_codename_01ab375a_uniq; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_codename_01ab375a_uniq UNIQUE (content_type_id, codename);


--
-- Name: auth_permission auth_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups auth_user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups auth_user_groups_user_id_group_id_94350c0c_uniq; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_group_id_94350c0c_uniq UNIQUE (user_id, group_id);


--
-- Name: auth_user auth_user_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions auth_user_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_permission_id_14a6b632_uniq; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_permission_id_14a6b632_uniq UNIQUE (user_id, permission_id);


--
-- Name: auth_user auth_user_username_key; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_username_key UNIQUE (username);


--
-- Name: django_admin_log django_admin_log_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);


--
-- Name: django_celery_beat_clockedschedule django_celery_beat_clockedschedule_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.django_celery_beat_clockedschedule
    ADD CONSTRAINT django_celery_beat_clockedschedule_pkey PRIMARY KEY (id);


--
-- Name: django_celery_beat_crontabschedule django_celery_beat_crontabschedule_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.django_celery_beat_crontabschedule
    ADD CONSTRAINT django_celery_beat_crontabschedule_pkey PRIMARY KEY (id);


--
-- Name: django_celery_beat_intervalschedule django_celery_beat_intervalschedule_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.django_celery_beat_intervalschedule
    ADD CONSTRAINT django_celery_beat_intervalschedule_pkey PRIMARY KEY (id);


--
-- Name: django_celery_beat_periodictask django_celery_beat_periodictask_name_key; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.django_celery_beat_periodictask
    ADD CONSTRAINT django_celery_beat_periodictask_name_key UNIQUE (name);


--
-- Name: django_celery_beat_periodictask django_celery_beat_periodictask_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.django_celery_beat_periodictask
    ADD CONSTRAINT django_celery_beat_periodictask_pkey PRIMARY KEY (id);


--
-- Name: django_celery_beat_periodictasks django_celery_beat_periodictasks_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.django_celery_beat_periodictasks
    ADD CONSTRAINT django_celery_beat_periodictasks_pkey PRIMARY KEY (ident);


--
-- Name: django_celery_beat_solarschedule django_celery_beat_solar_event_latitude_longitude_ba64999a_uniq; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.django_celery_beat_solarschedule
    ADD CONSTRAINT django_celery_beat_solar_event_latitude_longitude_ba64999a_uniq UNIQUE (event, latitude, longitude);


--
-- Name: django_celery_beat_solarschedule django_celery_beat_solarschedule_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.django_celery_beat_solarschedule
    ADD CONSTRAINT django_celery_beat_solarschedule_pkey PRIMARY KEY (id);


--
-- Name: django_content_type django_content_type_app_label_model_76bd3d3b_uniq; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_app_label_model_76bd3d3b_uniq UNIQUE (app_label, model);


--
-- Name: django_content_type django_content_type_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);


--
-- Name: django_migrations django_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);


--
-- Name: django_session django_session_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);


--
-- Name: ge_api_cde ge_api_cde_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_api_cde
    ADD CONSTRAINT ge_api_cde_pkey PRIMARY KEY (id);


--
-- Name: ge_api_dataprofile ge_api_dataprofile_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_api_dataprofile
    ADD CONSTRAINT ge_api_dataprofile_pkey PRIMARY KEY (id);


--
-- Name: ge_api_datasource ge_api_datasource_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_api_datasource
    ADD CONSTRAINT ge_api_datasource_pkey PRIMARY KEY (id);


--
-- Name: ge_api_dqdimension ge_api_dqdimension_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_api_dqdimension
    ADD CONSTRAINT ge_api_dqdimension_pkey PRIMARY KEY (id);


--
-- Name: ge_api_execution ge_api_execution_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_api_execution
    ADD CONSTRAINT ge_api_execution_pkey PRIMARY KEY (id);


--
-- Name: ge_api_project ge_api_project_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_api_project
    ADD CONSTRAINT ge_api_project_pkey PRIMARY KEY (id);


--
-- Name: ge_api_report ge_api_report_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_api_report
    ADD CONSTRAINT ge_api_report_pkey PRIMARY KEY (id);


--
-- Name: ge_api_result ge_api_result_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_api_result
    ADD CONSTRAINT ge_api_result_pkey PRIMARY KEY (id);


--
-- Name: ge_api_resultv1 ge_api_resultv1_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_api_resultv1
    ADD CONSTRAINT ge_api_resultv1_pkey PRIMARY KEY (id);


--
-- Name: ge_api_rule ge_api_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_api_rule
    ADD CONSTRAINT ge_api_rule_pkey PRIMARY KEY (id);


--
-- Name: ge_api_rulemodel ge_api_rulemodel_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_api_rulemodel
    ADD CONSTRAINT ge_api_rulemodel_pkey PRIMARY KEY (id);


--
-- Name: ge_checkpoint_store ge_checkpoint_store_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_checkpoint_store
    ADD CONSTRAINT ge_checkpoint_store_pkey PRIMARY KEY (checkpoint_name);


--
-- Name: ge_expectations_store ge_expectations_store_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_expectations_store
    ADD CONSTRAINT ge_expectations_store_pkey PRIMARY KEY (expectation_suite_name);


--
-- Name: ge_validations_store ge_validations_store_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_validations_store
    ADD CONSTRAINT ge_validations_store_pkey PRIMARY KEY (expectation_suite_name, run_name, run_time, batch_identifier);


--
-- Name: wizard_flow_data wizard_flow_data_datasource_name_key; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.wizard_flow_data
    ADD CONSTRAINT wizard_flow_data_datasource_name_key UNIQUE (datasource_name);


--
-- Name: wizard_flow_data wizard_flow_data_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.wizard_flow_data
    ADD CONSTRAINT wizard_flow_data_pkey PRIMARY KEY (id);


--
-- Name: auth_group_name_a6ea08ec_like; Type: INDEX; Schema: public; Owner: decdpdev
--

CREATE INDEX auth_group_name_a6ea08ec_like ON public.auth_group USING btree (name varchar_pattern_ops);


--
-- Name: auth_group_permissions_group_id_b120cbf9; Type: INDEX; Schema: public; Owner: decdpdev
--

CREATE INDEX auth_group_permissions_group_id_b120cbf9 ON public.auth_group_permissions USING btree (group_id);


--
-- Name: auth_group_permissions_permission_id_84c5c92e; Type: INDEX; Schema: public; Owner: decdpdev
--

CREATE INDEX auth_group_permissions_permission_id_84c5c92e ON public.auth_group_permissions USING btree (permission_id);


--
-- Name: auth_permission_content_type_id_2f476e4b; Type: INDEX; Schema: public; Owner: decdpdev
--

CREATE INDEX auth_permission_content_type_id_2f476e4b ON public.auth_permission USING btree (content_type_id);


--
-- Name: auth_user_groups_group_id_97559544; Type: INDEX; Schema: public; Owner: decdpdev
--

CREATE INDEX auth_user_groups_group_id_97559544 ON public.auth_user_groups USING btree (group_id);


--
-- Name: auth_user_groups_user_id_6a12ed8b; Type: INDEX; Schema: public; Owner: decdpdev
--

CREATE INDEX auth_user_groups_user_id_6a12ed8b ON public.auth_user_groups USING btree (user_id);


--
-- Name: auth_user_user_permissions_permission_id_1fbb5f2c; Type: INDEX; Schema: public; Owner: decdpdev
--

CREATE INDEX auth_user_user_permissions_permission_id_1fbb5f2c ON public.auth_user_user_permissions USING btree (permission_id);


--
-- Name: auth_user_user_permissions_user_id_a95ead1b; Type: INDEX; Schema: public; Owner: decdpdev
--

CREATE INDEX auth_user_user_permissions_user_id_a95ead1b ON public.auth_user_user_permissions USING btree (user_id);


--
-- Name: auth_user_username_6821ab7c_like; Type: INDEX; Schema: public; Owner: decdpdev
--

CREATE INDEX auth_user_username_6821ab7c_like ON public.auth_user USING btree (username varchar_pattern_ops);


--
-- Name: django_admin_log_content_type_id_c4bce8eb; Type: INDEX; Schema: public; Owner: decdpdev
--

CREATE INDEX django_admin_log_content_type_id_c4bce8eb ON public.django_admin_log USING btree (content_type_id);


--
-- Name: django_admin_log_user_id_c564eba6; Type: INDEX; Schema: public; Owner: decdpdev
--

CREATE INDEX django_admin_log_user_id_c564eba6 ON public.django_admin_log USING btree (user_id);


--
-- Name: django_celery_beat_periodictask_clocked_id_47a69f82; Type: INDEX; Schema: public; Owner: decdpdev
--

CREATE INDEX django_celery_beat_periodictask_clocked_id_47a69f82 ON public.django_celery_beat_periodictask USING btree (clocked_id);


--
-- Name: django_celery_beat_periodictask_crontab_id_d3cba168; Type: INDEX; Schema: public; Owner: decdpdev
--

CREATE INDEX django_celery_beat_periodictask_crontab_id_d3cba168 ON public.django_celery_beat_periodictask USING btree (crontab_id);


--
-- Name: django_celery_beat_periodictask_interval_id_a8ca27da; Type: INDEX; Schema: public; Owner: decdpdev
--

CREATE INDEX django_celery_beat_periodictask_interval_id_a8ca27da ON public.django_celery_beat_periodictask USING btree (interval_id);


--
-- Name: django_celery_beat_periodictask_name_265a36b7_like; Type: INDEX; Schema: public; Owner: decdpdev
--

CREATE INDEX django_celery_beat_periodictask_name_265a36b7_like ON public.django_celery_beat_periodictask USING btree (name varchar_pattern_ops);


--
-- Name: django_celery_beat_periodictask_solar_id_a87ce72c; Type: INDEX; Schema: public; Owner: decdpdev
--

CREATE INDEX django_celery_beat_periodictask_solar_id_a87ce72c ON public.django_celery_beat_periodictask USING btree (solar_id);


--
-- Name: django_session_expire_date_a5c62663; Type: INDEX; Schema: public; Owner: decdpdev
--

CREATE INDEX django_session_expire_date_a5c62663 ON public.django_session USING btree (expire_date);


--
-- Name: django_session_session_key_c0390e0f_like; Type: INDEX; Schema: public; Owner: decdpdev
--

CREATE INDEX django_session_session_key_c0390e0f_like ON public.django_session USING btree (session_key varchar_pattern_ops);


--
-- Name: ge_api_cde_project_id_id_04a06bb1; Type: INDEX; Schema: public; Owner: decdpdev
--

CREATE INDEX ge_api_cde_project_id_id_04a06bb1 ON public.ge_api_cde USING btree (project_id_id);


--
-- Name: ge_api_dataprofile_datasource_id_id_909570cc; Type: INDEX; Schema: public; Owner: decdpdev
--

CREATE INDEX ge_api_dataprofile_datasource_id_id_909570cc ON public.ge_api_dataprofile USING btree (datasource_id_id);


--
-- Name: ge_api_execution_project_id_id_34cf1899; Type: INDEX; Schema: public; Owner: decdpdev
--

CREATE INDEX ge_api_execution_project_id_id_34cf1899 ON public.ge_api_execution USING btree (project_id_id);


--
-- Name: ge_api_project_datasource_id_id_3fb2a57c; Type: INDEX; Schema: public; Owner: decdpdev
--

CREATE INDEX ge_api_project_datasource_id_id_3fb2a57c ON public.ge_api_project USING btree (datasource_id_id);


--
-- Name: ge_api_result_execution_id_id_ff067d78; Type: INDEX; Schema: public; Owner: decdpdev
--

CREATE INDEX ge_api_result_execution_id_id_ff067d78 ON public.ge_api_result USING btree (execution_id_id);


--
-- Name: ge_api_result_rule_id_id_1e3f6323; Type: INDEX; Schema: public; Owner: decdpdev
--

CREATE INDEX ge_api_result_rule_id_id_1e3f6323 ON public.ge_api_result USING btree (rule_id_id);


--
-- Name: ge_api_rule_cde_id_id_9f75b683; Type: INDEX; Schema: public; Owner: decdpdev
--

CREATE INDEX ge_api_rule_cde_id_id_9f75b683 ON public.ge_api_rule USING btree (cde_id_id);


--
-- Name: ge_api_rule_rule_model_id_id_2a062f60; Type: INDEX; Schema: public; Owner: decdpdev
--

CREATE INDEX ge_api_rule_rule_model_id_id_2a062f60 ON public.ge_api_rule USING btree (rule_model_id_id);


--
-- Name: ge_api_rulemodel_dq_dimension_id_id_338abf22; Type: INDEX; Schema: public; Owner: decdpdev
--

CREATE INDEX ge_api_rulemodel_dq_dimension_id_id_338abf22 ON public.ge_api_rulemodel USING btree (dq_dimension_id_id);


--
-- Name: auth_group_permissions auth_group_permissio_permission_id_84c5c92e_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissio_permission_id_84c5c92e_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissions_group_id_b120cbf9_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_permission auth_permission_content_type_id_2f476e4b_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups auth_user_groups_group_id_97559544_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_group_id_97559544_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups auth_user_groups_user_id_6a12ed8b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_6a12ed8b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permissions auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_content_type_id_c4bce8eb_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_content_type_id_c4bce8eb_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_user_id_c564eba6_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_user_id_c564eba6_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_celery_beat_periodictask django_celery_beat_p_clocked_id_47a69f82_fk_django_ce; Type: FK CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.django_celery_beat_periodictask
    ADD CONSTRAINT django_celery_beat_p_clocked_id_47a69f82_fk_django_ce FOREIGN KEY (clocked_id) REFERENCES public.django_celery_beat_clockedschedule(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_celery_beat_periodictask django_celery_beat_p_crontab_id_d3cba168_fk_django_ce; Type: FK CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.django_celery_beat_periodictask
    ADD CONSTRAINT django_celery_beat_p_crontab_id_d3cba168_fk_django_ce FOREIGN KEY (crontab_id) REFERENCES public.django_celery_beat_crontabschedule(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_celery_beat_periodictask django_celery_beat_p_interval_id_a8ca27da_fk_django_ce; Type: FK CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.django_celery_beat_periodictask
    ADD CONSTRAINT django_celery_beat_p_interval_id_a8ca27da_fk_django_ce FOREIGN KEY (interval_id) REFERENCES public.django_celery_beat_intervalschedule(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_celery_beat_periodictask django_celery_beat_p_solar_id_a87ce72c_fk_django_ce; Type: FK CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.django_celery_beat_periodictask
    ADD CONSTRAINT django_celery_beat_p_solar_id_a87ce72c_fk_django_ce FOREIGN KEY (solar_id) REFERENCES public.django_celery_beat_solarschedule(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: ge_api_cde ge_api_cde_project_id_id_04a06bb1_fk_ge_api_project_id; Type: FK CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_api_cde
    ADD CONSTRAINT ge_api_cde_project_id_id_04a06bb1_fk_ge_api_project_id FOREIGN KEY (project_id_id) REFERENCES public.ge_api_project(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: ge_api_dataprofile ge_api_dataprofile_datasource_id_id_909570cc_fk_ge_api_da; Type: FK CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_api_dataprofile
    ADD CONSTRAINT ge_api_dataprofile_datasource_id_id_909570cc_fk_ge_api_da FOREIGN KEY (datasource_id_id) REFERENCES public.ge_api_datasource(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: ge_api_execution ge_api_execution_project_id_id_34cf1899_fk_ge_api_project_id; Type: FK CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_api_execution
    ADD CONSTRAINT ge_api_execution_project_id_id_34cf1899_fk_ge_api_project_id FOREIGN KEY (project_id_id) REFERENCES public.ge_api_project(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: ge_api_project ge_api_project_datasource_id_id_3fb2a57c_fk_ge_api_da; Type: FK CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_api_project
    ADD CONSTRAINT ge_api_project_datasource_id_id_3fb2a57c_fk_ge_api_da FOREIGN KEY (datasource_id_id) REFERENCES public.ge_api_datasource(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: ge_api_result ge_api_result_execution_id_id_ff067d78_fk_ge_api_execution_id; Type: FK CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_api_result
    ADD CONSTRAINT ge_api_result_execution_id_id_ff067d78_fk_ge_api_execution_id FOREIGN KEY (execution_id_id) REFERENCES public.ge_api_execution(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: ge_api_result ge_api_result_rule_id_id_1e3f6323_fk_ge_api_rule_id; Type: FK CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_api_result
    ADD CONSTRAINT ge_api_result_rule_id_id_1e3f6323_fk_ge_api_rule_id FOREIGN KEY (rule_id_id) REFERENCES public.ge_api_rule(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: ge_api_rule ge_api_rule_cde_id_id_9f75b683_fk_ge_api_cde_id; Type: FK CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_api_rule
    ADD CONSTRAINT ge_api_rule_cde_id_id_9f75b683_fk_ge_api_cde_id FOREIGN KEY (cde_id_id) REFERENCES public.ge_api_cde(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: ge_api_rule ge_api_rule_rule_model_id_id_2a062f60_fk_ge_api_rulemodel_id; Type: FK CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_api_rule
    ADD CONSTRAINT ge_api_rule_rule_model_id_id_2a062f60_fk_ge_api_rulemodel_id FOREIGN KEY (rule_model_id_id) REFERENCES public.ge_api_rulemodel(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: ge_api_rulemodel ge_api_rulemodel_dq_dimension_id_id_338abf22_fk_ge_api_dq; Type: FK CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.ge_api_rulemodel
    ADD CONSTRAINT ge_api_rulemodel_dq_dimension_id_id_338abf22_fk_ge_api_dq FOREIGN KEY (dq_dimension_id_id) REFERENCES public.ge_api_dqdimension(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: azure_pg_admin
--

REVOKE ALL ON SCHEMA public FROM azuresu;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO azure_pg_admin;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- Name: FUNCTION pg_replication_origin_advance(text, pg_lsn); Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_advance(text, pg_lsn) TO azure_pg_admin;


--
-- Name: FUNCTION pg_replication_origin_create(text); Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_create(text) TO azure_pg_admin;


--
-- Name: FUNCTION pg_replication_origin_drop(text); Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_drop(text) TO azure_pg_admin;


--
-- Name: FUNCTION pg_replication_origin_oid(text); Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_oid(text) TO azure_pg_admin;


--
-- Name: FUNCTION pg_replication_origin_progress(text, boolean); Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_progress(text, boolean) TO azure_pg_admin;


--
-- Name: FUNCTION pg_replication_origin_session_is_setup(); Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_session_is_setup() TO azure_pg_admin;


--
-- Name: FUNCTION pg_replication_origin_session_progress(boolean); Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_session_progress(boolean) TO azure_pg_admin;


--
-- Name: FUNCTION pg_replication_origin_session_reset(); Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_session_reset() TO azure_pg_admin;


--
-- Name: FUNCTION pg_replication_origin_session_setup(text); Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_session_setup(text) TO azure_pg_admin;


--
-- Name: FUNCTION pg_replication_origin_xact_reset(); Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_xact_reset() TO azure_pg_admin;


--
-- Name: FUNCTION pg_replication_origin_xact_setup(pg_lsn, timestamp with time zone); Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_xact_setup(pg_lsn, timestamp with time zone) TO azure_pg_admin;


--
-- Name: FUNCTION pg_show_replication_origin_status(OUT local_id oid, OUT external_id text, OUT remote_lsn pg_lsn, OUT local_lsn pg_lsn); Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT ALL ON FUNCTION pg_catalog.pg_show_replication_origin_status(OUT local_id oid, OUT external_id text, OUT remote_lsn pg_lsn, OUT local_lsn pg_lsn) TO azure_pg_admin;


--
-- Name: FUNCTION pg_stat_reset(); Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT ALL ON FUNCTION pg_catalog.pg_stat_reset() TO azure_pg_admin;


--
-- Name: FUNCTION pg_stat_reset_shared(text); Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT ALL ON FUNCTION pg_catalog.pg_stat_reset_shared(text) TO azure_pg_admin;


--
-- Name: FUNCTION pg_stat_reset_single_function_counters(oid); Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT ALL ON FUNCTION pg_catalog.pg_stat_reset_single_function_counters(oid) TO azure_pg_admin;


--
-- Name: FUNCTION pg_stat_reset_single_table_counters(oid); Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT ALL ON FUNCTION pg_catalog.pg_stat_reset_single_table_counters(oid) TO azure_pg_admin;


--
-- Name: COLUMN pg_config.name; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(name) ON TABLE pg_catalog.pg_config TO azure_pg_admin;


--
-- Name: COLUMN pg_config.setting; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(setting) ON TABLE pg_catalog.pg_config TO azure_pg_admin;


--
-- Name: COLUMN pg_hba_file_rules.line_number; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(line_number) ON TABLE pg_catalog.pg_hba_file_rules TO azure_pg_admin;


--
-- Name: COLUMN pg_hba_file_rules.type; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(type) ON TABLE pg_catalog.pg_hba_file_rules TO azure_pg_admin;


--
-- Name: COLUMN pg_hba_file_rules.database; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(database) ON TABLE pg_catalog.pg_hba_file_rules TO azure_pg_admin;


--
-- Name: COLUMN pg_hba_file_rules.user_name; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(user_name) ON TABLE pg_catalog.pg_hba_file_rules TO azure_pg_admin;


--
-- Name: COLUMN pg_hba_file_rules.address; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(address) ON TABLE pg_catalog.pg_hba_file_rules TO azure_pg_admin;


--
-- Name: COLUMN pg_hba_file_rules.netmask; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(netmask) ON TABLE pg_catalog.pg_hba_file_rules TO azure_pg_admin;


--
-- Name: COLUMN pg_hba_file_rules.auth_method; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(auth_method) ON TABLE pg_catalog.pg_hba_file_rules TO azure_pg_admin;


--
-- Name: COLUMN pg_hba_file_rules.options; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(options) ON TABLE pg_catalog.pg_hba_file_rules TO azure_pg_admin;


--
-- Name: COLUMN pg_hba_file_rules.error; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(error) ON TABLE pg_catalog.pg_hba_file_rules TO azure_pg_admin;


--
-- Name: COLUMN pg_replication_origin_status.local_id; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(local_id) ON TABLE pg_catalog.pg_replication_origin_status TO azure_pg_admin;


--
-- Name: COLUMN pg_replication_origin_status.external_id; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(external_id) ON TABLE pg_catalog.pg_replication_origin_status TO azure_pg_admin;


--
-- Name: COLUMN pg_replication_origin_status.remote_lsn; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(remote_lsn) ON TABLE pg_catalog.pg_replication_origin_status TO azure_pg_admin;


--
-- Name: COLUMN pg_replication_origin_status.local_lsn; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(local_lsn) ON TABLE pg_catalog.pg_replication_origin_status TO azure_pg_admin;


--
-- Name: COLUMN pg_shmem_allocations.name; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(name) ON TABLE pg_catalog.pg_shmem_allocations TO azure_pg_admin;


--
-- Name: COLUMN pg_shmem_allocations.off; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(off) ON TABLE pg_catalog.pg_shmem_allocations TO azure_pg_admin;


--
-- Name: COLUMN pg_shmem_allocations.size; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(size) ON TABLE pg_catalog.pg_shmem_allocations TO azure_pg_admin;


--
-- Name: COLUMN pg_shmem_allocations.allocated_size; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(allocated_size) ON TABLE pg_catalog.pg_shmem_allocations TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.starelid; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(starelid) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.staattnum; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(staattnum) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stainherit; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stainherit) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stanullfrac; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stanullfrac) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stawidth; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stawidth) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stadistinct; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stadistinct) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stakind1; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stakind1) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stakind2; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stakind2) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stakind3; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stakind3) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stakind4; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stakind4) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stakind5; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stakind5) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.staop1; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(staop1) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.staop2; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(staop2) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.staop3; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(staop3) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.staop4; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(staop4) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.staop5; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(staop5) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stacoll1; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stacoll1) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stacoll2; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stacoll2) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stacoll3; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stacoll3) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stacoll4; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stacoll4) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stacoll5; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stacoll5) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stanumbers1; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stanumbers1) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stanumbers2; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stanumbers2) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stanumbers3; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stanumbers3) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stanumbers4; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stanumbers4) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stanumbers5; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stanumbers5) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stavalues1; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stavalues1) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stavalues2; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stavalues2) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stavalues3; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stavalues3) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stavalues4; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stavalues4) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stavalues5; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stavalues5) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_subscription.oid; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(oid) ON TABLE pg_catalog.pg_subscription TO azure_pg_admin;


--
-- Name: COLUMN pg_subscription.subdbid; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(subdbid) ON TABLE pg_catalog.pg_subscription TO azure_pg_admin;


--
-- Name: COLUMN pg_subscription.subname; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(subname) ON TABLE pg_catalog.pg_subscription TO azure_pg_admin;


--
-- Name: COLUMN pg_subscription.subowner; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(subowner) ON TABLE pg_catalog.pg_subscription TO azure_pg_admin;


--
-- Name: COLUMN pg_subscription.subenabled; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(subenabled) ON TABLE pg_catalog.pg_subscription TO azure_pg_admin;


--
-- Name: COLUMN pg_subscription.subconninfo; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(subconninfo) ON TABLE pg_catalog.pg_subscription TO azure_pg_admin;


--
-- Name: COLUMN pg_subscription.subslotname; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(subslotname) ON TABLE pg_catalog.pg_subscription TO azure_pg_admin;


--
-- Name: COLUMN pg_subscription.subsynccommit; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(subsynccommit) ON TABLE pg_catalog.pg_subscription TO azure_pg_admin;


--
-- Name: COLUMN pg_subscription.subpublications; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(subpublications) ON TABLE pg_catalog.pg_subscription TO azure_pg_admin;


--
-- PostgreSQL database dump complete
--

