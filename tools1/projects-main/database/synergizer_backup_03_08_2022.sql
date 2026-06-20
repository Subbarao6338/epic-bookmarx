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
-- Name: config_api_configstring; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.config_api_configstring (
    id integer NOT NULL,
    config_name character varying(100) NOT NULL,
    format character varying(40),
    value text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.config_api_configstring OWNER TO decdpdev;

--
-- Name: config_api_configstring_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public.config_api_configstring_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.config_api_configstring_id_seq OWNER TO decdpdev;

--
-- Name: config_api_configstring_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public.config_api_configstring_id_seq OWNED BY public.config_api_configstring.id;


--
-- Name: config_api_influx; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.config_api_influx (
    id integer NOT NULL,
    configured_value jsonb,
    is_active boolean NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.config_api_influx OWNER TO decdpdev;

--
-- Name: config_api_influx_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public.config_api_influx_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.config_api_influx_id_seq OWNER TO decdpdev;

--
-- Name: config_api_influx_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public.config_api_influx_id_seq OWNED BY public.config_api_influx.id;


--
-- Name: config_api_influxsource; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.config_api_influxsource (
    id integer NOT NULL,
    default_config jsonb NOT NULL,
    configured_value jsonb,
    is_active boolean NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.config_api_influxsource OWNER TO decdpdev;

--
-- Name: config_api_influxsource_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public.config_api_influxsource_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.config_api_influxsource_id_seq OWNER TO decdpdev;

--
-- Name: config_api_influxsource_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public.config_api_influxsource_id_seq OWNED BY public.config_api_influxsource.id;


--
-- Name: config_api_metricsource; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.config_api_metricsource (
    id integer NOT NULL,
    source_name character varying(40) NOT NULL,
    default_config jsonb NOT NULL,
    configured_value jsonb,
    is_active boolean NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    icon character varying(800) NOT NULL,
    describe character varying(600) NOT NULL,
    description character varying(8000) NOT NULL,
    image character varying(8000) NOT NULL
);


ALTER TABLE public.config_api_metricsource OWNER TO decdpdev;

--
-- Name: config_api_metricsource_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public.config_api_metricsource_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.config_api_metricsource_id_seq OWNER TO decdpdev;

--
-- Name: config_api_metricsource_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public.config_api_metricsource_id_seq OWNED BY public.config_api_metricsource.id;


--
-- Name: config_api_promconfig; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.config_api_promconfig (
    id integer NOT NULL,
    config_yml text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.config_api_promconfig OWNER TO decdpdev;

--
-- Name: config_api_promconfig_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public.config_api_promconfig_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.config_api_promconfig_id_seq OWNER TO decdpdev;

--
-- Name: config_api_promconfig_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public.config_api_promconfig_id_seq OWNED BY public.config_api_promconfig.id;


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
-- Name: config_api_configstring id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.config_api_configstring ALTER COLUMN id SET DEFAULT nextval('public.config_api_configstring_id_seq'::regclass);


--
-- Name: config_api_influx id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.config_api_influx ALTER COLUMN id SET DEFAULT nextval('public.config_api_influx_id_seq'::regclass);


--
-- Name: config_api_influxsource id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.config_api_influxsource ALTER COLUMN id SET DEFAULT nextval('public.config_api_influxsource_id_seq'::regclass);


--
-- Name: config_api_metricsource id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.config_api_metricsource ALTER COLUMN id SET DEFAULT nextval('public.config_api_metricsource_id_seq'::regclass);


--
-- Name: config_api_promconfig id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.config_api_promconfig ALTER COLUMN id SET DEFAULT nextval('public.config_api_promconfig_id_seq'::regclass);


--
-- Name: django_admin_log id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.django_admin_log ALTER COLUMN id SET DEFAULT nextval('public.django_admin_log_id_seq'::regclass);


--
-- Name: django_content_type id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.django_content_type ALTER COLUMN id SET DEFAULT nextval('public.django_content_type_id_seq'::regclass);


--
-- Name: django_migrations id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.django_migrations ALTER COLUMN id SET DEFAULT nextval('public.django_migrations_id_seq'::regclass);


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
25	Can add prom config	7	add_promconfig
26	Can change prom config	7	change_promconfig
27	Can delete prom config	7	delete_promconfig
28	Can view prom config	7	view_promconfig
29	Can add metric source	8	add_metricsource
30	Can change metric source	8	change_metricsource
31	Can delete metric source	8	delete_metricsource
32	Can view metric source	8	view_metricsource
33	Can add influxdb config	9	add_influxdbconfig
34	Can change influxdb config	9	change_influxdbconfig
35	Can delete influxdb config	9	delete_influxdbconfig
36	Can view influxdb config	9	view_influxdbconfig
37	Can add influx	10	add_influx
38	Can change influx	10	change_influx
39	Can delete influx	10	delete_influx
40	Can view influx	10	view_influx
41	Can add influx source	11	add_influxsource
42	Can change influx source	11	change_influxsource
43	Can delete influx source	11	delete_influxsource
44	Can view influx source	11	view_influxsource
45	Can add config string	12	add_configstring
46	Can change config string	12	change_configstring
47	Can delete config string	12	delete_configstring
48	Can view config string	12	view_configstring
\.


--
-- Data for Name: auth_user; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined) FROM stdin;
1	pbkdf2_sha256$320000$tQWdS3vXWtAa7iN6JaNwBh$qGBRrptxtvUBz2ubwvVU1SXDiAmxpmQmmgMJHyG6E5c=	2022-05-11 05:22:36.029858+00	t	admin				t	t	2022-05-11 05:21:04.753065+00
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
-- Data for Name: config_api_configstring; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.config_api_configstring (id, config_name, format, value, created_at, updated_at) FROM stdin;
5	prometheus	json	{"url":"http://20.204.104.9:9090","config_yml":"##############"}	2022-06-19 16:58:47.962991+00	2022-06-28 03:45:21.824884+00
2	visualization	json	{"url":"http://20.204.104.9:5000","token":"eyJrIjoiY2h4Mzh6NjJpbDY3bDVMZjdVeFpmUjJpTWN6RzRoRUgiLCJuIjoiZ3JhZmFuYV9hcGkiLCJpZCI6MX0=","default_embed_url":"http://20.204.104.9:5000/d/9wTL7uunk/observability-dashbord?orgId=1"}	2022-06-08 11:53:59.611866+00	2022-07-01 12:16:51.670492+00
4	metric_storage	json	{"url":"http://20.204.104.9:8086","org":"my-org","bucket":"my-bucket","token":"vqRI2EmaHVv7q5sEgHb5qKpqSuXlQBCz6sTSAB2n4GwQCMT-Fi9B4dxNEhOpbe4sSM9_vVfQ-F00Pre6mrnnoA=="}	2022-06-13 14:37:39.197147+00	2022-07-22 10:54:07.237659+00
\.


--
-- Data for Name: config_api_influx; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.config_api_influx (id, configured_value, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: config_api_influxsource; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.config_api_influxsource (id, default_config, configured_value, is_active, created_at, updated_at) FROM stdin;
1	{"helpText": "", "inputFields": [{"name": "Influxdb_URL", "label": "Influxdb_URL", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "Username", "label": "Username", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "Password", "label": "Password", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "Database", "label": "Database", "isRequired": false, "placeholder": "", "defaultValue": ""}]}	{"helpText": "", "inputFields": [{"name": "Influxdb_URL", "label": "Influxdb_URL", "value": "", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "Username", "label": "Username", "value": "", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "Password", "label": "Password", "value": "", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "Database", "label": "Database", "value": "", "isRequired": false, "placeholder": "", "defaultValue": ""}]}	f	2022-06-02 03:08:59.597852+00	2022-06-02 03:13:42.415118+00
\.


--
-- Data for Name: config_api_metricsource; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.config_api_metricsource (id, source_name, default_config, configured_value, is_active, created_at, updated_at, icon, describe, description, image) FROM stdin;
2	Airflow	{"helpText": "", "inputFields": [{"name": "Target_urls", "label": "Target_urls", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "Metrics", "label": "Metrics", "isRequired": false, "placeholder": "", "defaultValue": ""}]}	{"helpText": "", "inputFields": [{"name": "target_urls", "label": "target_urls", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "metrics", "label": "metrics", "isRequired": false, "placeholder": "", "defaultValue": ""}]}	f	2022-06-01 12:25:09.017156+00	2022-06-20 09:55:25.928833+00	False	False	Workflow engine Manage scheduling and running jobs and data pipelines	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABxVBMVEX///8Ax9QArUbkOSEBfO4R4e4E1ln/dVcMtv8AxNIAeu5KSEgMuP8Aq0UAcu0Muf8Adu0AqTjkNBr/dFYAqz8As/8AcO0AdvTjJwAAvP8Ay9rjMRUApzLjLQz/b0z//PsE2k4L1eIS5Pb/b00E20sA1E387OrmTDjjKQD98O6O4efe9vjL8fToQyv/fGD0X0Sp6O0DhPAGkvQKqvsJovkCv04DsKOhx/f2xsHnVkXrem7529dj1+Dqc2a36e6W4+nujYPwm5P40s7u+/z/xLn/rJzQSkRTxv8JpfrA2frb6vxYn/IDw1AO19ECktAN0sN7sPQEtGIJwpJ55Zyh7Lmz0fjD89Pk9erR7dqT1aeo27bqc2jyqaPmUT/oZVfxpZ75iHS2YXCOgKR+ha2uaHv/oY5Iot2fc4+8jH/J7v9vr7LQinraQC+uZXWdoJpDu8LHU1bhgmxmk8SHp6WmnJRjsrV4z/+0louY2/+iPzO2Oy04botMQDgyjfARdts9eHspZqw+YmZGU0JONTJMQkg2jZMDtpkzeEg9Xj0BwIMDprMBiN0IwIsEzG4LyqqNuvUBj9NzyY1Pv3OF5qQ/3Xd4y5Ka16z2U65VAAAOTklEQVR4nO3di1sU1xUA8H3BsuPCPlhdFBbEDS/NahaJQdCIYlMfSQy2KhAliaYmbWxt2rQ1TekjTW3VJqm0+Pf2zszO7Dzu+5y7g197vi/f52eQ+PvOufecO3OXpFL/CzExPT09NzeR9F/DXCyO+NGoZlszp09vvb+0tLJy/vbFxcULy9NzEy8p/kz6jPuLmWo2EFU7Rkk0Go3ZDrw6c/rs0soHFxcvTL9EqT5TSBdec351ejQrCgftgrN3tpbO315c3vNUAkwXjjq/XG5UhcSQ1rHOtk4vfXBxeTphBzNsoCdMLVeViD51tGFDt1ZuL88lq6GEA/SFqelRLaIHnR1ptM5+cGEvMV1gV5ia1stiIOx8tpZuLyfJ6sZRF5gunPN/ay4LJTpMsj7P7gGlBwwKkYiucnRlMdGK9YFet3BjriVuGtLKkZGt24ntsl1gWIhKJPvPbFLIADBdeDP0rybuYBJd5MWezwXnAsCoMDUhMd0oIkeqK73deELAmNAAMZttjGwt9g74WggYFxohkkS2LiYDpAgJsYFP7JkxCkwXXqV8lREiMWbN12oMSBemtowQs9mRO4b3nDdjwHThGPUrt2bNEKsjKyZ7BwXIEqbOGiJmGwZL9VUKkCk0RzSXRiowXVhlff37I4aI2caMkdVIB6YL7D+xZIxYHTFQqQxgOs35MyvGiNmR8z0D8oRGiUu4wGNMIFeYOm+QuNUjIF9okthAJB5j+9KHBH/WJPFsL4DeU/1EiLNIxFUeUCw0SvzQPFBCmLptsFARiAJgQUJoktj6EDrBCYCBR968uGhuujlxHEgUAEMPhBMhtoZhRBEw8rg0AWL1BIh4iNPpO8L4Yxp6LJoitvIAohgoLzRGrDYJUfMVhwSQ8ZiGGhcMEWfyukQZIPuI3ztiNU+IeY3XG1JAzhG/Z8TqCT3iGSlgOq0iNEQkZUqIw4pEWaDg8NQbYt4hNpWI0kDR4SkayyNIr4kDUR1WJ0oDZQbvcEzP4hNP5F3iuDRRHqguhN1KocdM3iNKPmVUAMoN3hEi+FZKNFp5NaICUHbwNk3Md4kXxP/9owpA6cE7QsS6leLFsApRCagytIWIqFc2gkIxUQ2oNLQFY24GldjMSxMVgWpDmzFi9UQ+ROS81FAFqo40gZjAJIaE+fw484W/OlB1pDFEjAiZxHPKQI2Gb4QYFTKI8VsIwpB6lsgmol3ZiAmpRA2gXsMPELGubMSFFKIOUOEpDSOQiBRhjKgF1G6H3UC5z1ClCfPjP4AD9dshLpEuDBFpF2WkAgxEIVaHqcIAkf2SXhCAdohKZAh9ojYQ1A4DRPDDG5awQ9QHApuFH86VjdHZ2Vm1jxZ1gwV0ifpAeLPoEhujH929d/fjB1rIFluYH/8JAIjQLHziR8WDpVLpYOn+J1n1ZckT5pufHtIXqj0O5sVP9xcHnCgeHLg7qjoG0JuFn8WfAYh4wAE/iPFjtYeqjHboxfBn+kKcrTQMdIz3H6iUKqsdesIPtYFYW2kESKJU/LlKB+EC88PH9YV6j6GicSUGtNN4T/7ZOHejgeUQZSs9RgGSOHi/KntAnhEIAesQBUj12ZU6cEduTxVsNPnmL7SFGBsNE0gqtfiWFFGw0eSbD3WBGBvNsSJbOFAc+KUUUVCkn2unEGGj4QLtLMoQBRtN89f6QvBEs8r1yRaqoN/r76TwjWaVn0GX+EC0owqWYVN/ZtN5dRgGloRAmyh8oWpqFcKPTiV6I4xE6b5ggJvhp1B7I4Uvw4NSQEL8FX+A4y5DQC9MA5fhqiyQTDd3uVnkLUPIOANchgpAQvyIQ+T1CsDMnYYuQxUg6fx3mLsNd2RrPoTUKGgZKgEJkbPbcIoUdLiHDaU/VAOSOr3H2m04RTquP8w4KQQMpcpAeykyZht2kY5/AQJCzoYaQNL4GU8Z2c+CgUDA83wdILMrMosUDNTvFXpAUqcfU3Yb5k46Dur0jlC3SHWBpE5blDplvXSCbTJ26Bbpb3WB9DqlF+lw8zdgoG6RAoDU/ZRapMPHQY2+I9QrUhCQjDaxoyIN2Py8AAdqFqkHLBaLpVLJe1Fh/9IOiSTemxWncPx3CD7NO5cOkOCKJxfm59vtXCfa7e35+YWT+4slIbP4VvjnT8b3mWHAkT4UOjMpARLCyfl2ziKRC4bl/E6bOG0mWxg5Dcf3mebnCEswrXkT6hFJ0sn5XMQWhebaXGV4s4kW6TBOhab19plH+0sL7TKHF2ASJQMZPmREE3gc3iQ6oZHCR/sX2hI8X5mbvzRQoiAPfjLLSOFw89M0FlDjSfCjSwo+H7kQR5IJ3N9nTCVQp1U8mlf0ecjtWCa7D21mQgn8Ai2BOo8vHuV0gF4mT4aaiJ/EajPg+wxnC/VCFXhDZoPhINsL+wOJLHWS2AoUKFIP7IRyCi8PAXwd5Palbh6Lzoc1/HMTboHaoboKLx+AAh1kbt5LJElitVrN+i0QYwoNhmovxAHaRmv+pGMslh58+eXvT7g+5AWYVh9nrmABbWO5fcke2r/aZ8dZ4kOa0cKhNpGuQvYYGjK3UPrqD45wXx4/f2n1Q8U2spAY/9gB7vuTAZ9yjb5Xxgbmcn/2hPtMCBVr9Aa4T8TDMipUbIWr+L5glf4FX6j6+Okqfo1a9WePv3aBf304iQ5UXIT4NWrVt68fPvz2N9/YwL/19fVhG9WAKXxf+/HhqX4Sf/963z8e9jkxmQZccY6E6vtC7H20bp1yff39mVqt9uRIX8co9/M7JICK0xrmMEOiXH/af9j19b8+mMlkxt7p82MyCSDuNmPV3/3W8/X328BMN4luIsFCVSBqCuvPnrzi+/pfzzgRTCI4kYVDyk9mruKNa+XyqampLtBNYTSJsG2nMKkMvILWKcIFSuLtjjCWRMeoh1QH4q3Ccu5xyEc2Ui9qa7Ek6iEn+9QvzqClsP5ufwTop5Ak8RqVqNhBJvs0gFi90Ko/fqU/Eq93hZk1BlA6lQXb16dzERgHWH/27eEosD8AzFS+YyXRU3KbyKFJ56t07na9gSG06k/jvlAKyVLkAnnOjk4TiHKyt6zrsQoN7jOu8J/8JEaknQj9rtabUIx9prxNqdDQPuPWKaVjKIXezS6EfYbsoVMUYKRI7Y6RBBDh2ERdgvEildhsjADhT/Hrp2hLkFKkwDrVvXwInmfq0TGmm8K4kDHZyIT2xTXgRmrVr7OA/XEgmWx061QbCCxSq/6ECYzuMx1ij4HQnZSTQVqRatcp4IozyMcFUovU3myuqxMBQFi7Z+6iTpHSgfYho4fA1PeQIq0/5QDjzbAbPQSCZtLyv3hAVpGqL0UQcBXwBMpq83y0dq+3FGEf7r0MKNL6E+os6hcpR6jUFUFASK9gDqPCInWy+I4sEQZMtcUSRljPuBnkFqmzFiUHVCAQsAwFNcruFZ5wsBdAwDIsv8uvUV6v6BBlzopQIKAb1tf4QMEylCSCgfrd0BKlULQMpYgIPzBIP4XX+atQuAxliAhA/aHUEtSoeBl6RHbTwPiRT9oPSi3+vCa1DF1ihtkXUX6mlXa/Lwu6vdQydKPCeJuB80O7tDea+inBMpQXZsaoMyrSTyXTPlcIhfQHGIwsrsUrFQmov9EIq1TeR6IWm8OxfnLeDe1mYT0TCBVS6Kbx2pEj+EDI+b5+CnKwoMTY2rU+F3mkbwMLCLmeYLV/xFuJChuNF7XK4PVr5LzxzneDY7tYQsDRKXclxSNqCB1kpUb+IQl9jgPUv/JsWVfIn+cQpWY2TlRwiNpbqVW+4nwDNhEqzFR2MIS6h0MPyCFyn9H0jqg5lXaBbCJciELUnEoDwFTq33Qi2IdD1PoIXhjIImIIEYhazaJ8OfJdfkwjogjBRK1mMRQF0ok4QnJABgl1mgUFSCUiCYFEjZe/VCCNiCWEEdVPFgfoQAoRTQgiKp8smEBCZF0qxSBqn4ZV2+GBG5xvdnPKlDBTG9QlKp6dDrzB/W5hIsJMEyBmbukJ1R5DDfGBEaLKYxpzRKWGLwSGieCzBQZRqeFLAENEvRMwMlHlMySCNRgnYgu1iAojzdD3kt9z3SciA0lUlIny59+h96S/qU/EF2Yq64pC6ZFGAZhK3ZoystU4MaZIlD3hKwF9IvpCtEMxi5IjjSKQEN0kmhAqEuWuBisDPSJuz9ciSg1tZXVgh2ikTNWIMkNb+aoGsEM0I8yM3cQUagJdoond1CFuyv4txGOpNpCMhOaSKE8UphAAdIimkihNFI2lICAJc0mUJIoG7/I8DJhK/cfQdipLFAzecCAhVhIl8p8llrfhQJtoSpgZE78J5x4tcICp1E6SRN7RoryN9X8RNEkUveznCPGAiRLZhyesEk2ayHzibbXxMmjH86SILKGVQ/XZxLFkiIwDsJXDzaAdL8wRebdS6EL7JhB+rNdqCRCpR3wzQDKH7xhLI/tNOO2IbwpI4kXFVBqZRIrQIJAcio2lkUWMH/Hdy2rmYrNmqG8wiHFh2SyQxMaYmVKlE2PCIeNAsuM8N2OkvuyPPqZhXLPAjltmjDRiRMi5hYBt3DWxHinERDLYic01/ETGiVZyQBLrz2vYDTJ2K6WcJJDE6uZOBRdZWwu/Qw0Ih3gXZV4iZG0wROw+TOTeBDIcqzefZ8bQlOGX/b5Q8haCuVh/sTOGpAwS/Q9xJw50Yn0DRxkgesK9AXTi1ubuWoUwQc4usSPcQ0A31jd3dzIQZ63WIbqvLQ7IXpTpbdyynYO1MftDQurSzmtiRyh9EyiRWCXQjR1b6lKlrTWn9dvCvQ30w5Zubjzf2Vkj5UuwLpcD7rwIv3pgj5YoJ1YJdv3m5ouNXdu7Zn/41I2KHzX7w2+d8e1yD86DPYhbBE3YN29ubm6+eLGxsbG7oXnf9v+xx+K/6RlDs9VvwlIAAAAASUVORK5CYII=
4	Synapse	{"helpText": "", "inputFields": [{"name": "Database", "label": "Database", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "Username", "label": "Username", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "Password", "label": "Password", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "Account Name", "label": "Account Name", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "Warehouse Name", "label": "Warehouse Name", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "Schema Name", "label": "Schema Name", "isRequired": false, "placeholder": "", "defaultValue": ""}]}	{"inputFields": [{"name": "Database", "label": "Database", "value": "", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "Username", "label": "Username", "value": "", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "Password", "label": "Password", "value": "", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "Account Name", "label": "Account Name", "value": "", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "Warehouse Name", "label": "Warehouse Name", "value": "", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "Schema Name", "label": "Schema Name", "value": "", "isRequired": false, "placeholder": "", "defaultValue": ""}]}	f	2022-06-01 12:46:20.08324+00	2022-06-01 13:03:35.69337+00	False	False	Limitless analytics service that brings together data integration, enterprise data warehousing & big data analytics 	data:image/png;base64,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
6	PostgreSQL	{"helpText": "", "inputFields": [{"name": "Server", "label": "Server", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "Port", "label": "Port", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "Username", "label": "Username", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "Password", "label": "Password", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "Target_URL", "label": "Target_URL", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "Metrics", "label": "Metrics", "isRequired": false, "placeholder": "", "defaultValue": ""}]}	{"inputFields": [{"name": "Server", "label": "Server", "value": "", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "Port", "label": "Port", "value": "", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "Username", "label": "Username", "value": "", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "Password", "label": "Password", "value": "", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "Target_URL", "label": "Target_URL", "value": "", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "Metrics", "label": "Metrics", "value": "", "isRequired": false, "placeholder": "", "defaultValue": ""}]}	f	2022-06-01 12:52:35.322405+00	2022-06-01 12:57:12.854186+00	False	False	Advanced, enterprise class open source relational database that supports both SQL and JSON querying	data:image/png;base64,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\n
1	AzureMonitor	{"helpText": "", "inputFields": [{"name": "Active_directory_authority_url", "label": "Active_directory_authority_url", "isRequired": false, "placeholder": "", "defaultValue": "https://login.microsoftonline.com/"}, {"name": "Resource_manager_url", "label": "Resource_manager_url", "isRequired": false, "placeholder": "", "defaultValue": "https://management.azure.com/"}, {"name": "Subscription_id", "label": "Subscription_id", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "Client_id", "label": "Client_id", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "Client_secret", "label": "Client_secret", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "Target_urls", "label": "Target_urls", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "Metrics", "label": "Metrics", "isRequired": false, "placeholder": "", "defaultValue": ""}]}	{"helpText": "", "inputFields": [{"name": "active_directory_authority_url", "label": "active_directory_authority_url", "isRequired": false, "placeholder": "", "defaultValue": "https://login.microsoftonline.com/"}, {"name": "resource_manager_url", "label": "resource_manager_url", "isRequired": false, "placeholder": "", "defaultValue": "https://management.azure.com/"}, {"name": "subscription_id", "label": "subscription_id", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "client_id", "label": "client_id", "value": "aaaaaaaaa", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "client_secret", "label": "client_secret", "value": "sssss", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "target_urls", "label": "target_urls", "value": "sssss", "isRequired": false, "placeholder": "", "defaultValue": ""}, {"name": "metrics", "label": "metrics", "value": "ccccccccc", "isRequired": false, "placeholder": "", "defaultValue": ""}]}	f	2022-06-01 11:40:08.759779+00	2022-06-20 06:21:29.022518+00	False	False	Collects, analyse and act on telemetry data from your Azure and on-premises environments 	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtm8uRc444DV-6FHChD5VKWkSNspoAOTbYUQ&usqp=CAU
\.


--
-- Data for Name: config_api_promconfig; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.config_api_promconfig (id, config_yml, created_at, updated_at) FROM stdin;
1	global:\nscrape_interval: 15s\nscrape_timeout: 10s\nevaluation_interval: 1m\n\nremote_write:\n- url: "http://influxdb:8086/api/v1/prom/write?u=admin&p=admin&db=prometheus"\nremote_read:\n- url: "http://influxdb:8086/api/v1/prom/read?u=admin&p=admin&db=prometheus"\n\nscrape_configs:\n- job_name: "prometheus"\n  static_configs:\n    - targets: ["prometheus:9090"]	2022-06-01 09:23:11.23656+00	2022-06-01 09:23:11.23656+00
\.


--
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.django_admin_log (id, action_time, object_id, object_repr, action_flag, change_message, content_type_id, user_id) FROM stdin;
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
7	config_api	promconfig
8	config_api	metricsource
9	config_api	influxdbconfig
10	config_api	influx
11	config_api	influxsource
12	config_api	configstring
\.


--
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.django_migrations (id, app, name, applied) FROM stdin;
1	config_api	0001_initial	2022-06-08 11:25:48.551109+00
2	config_api	0002_configstring	2022-06-08 11:34:06.059917+00
3	contenttypes	0001_initial	2022-06-13 06:23:15.70908+00
4	auth	0001_initial	2022-06-13 06:23:16.389825+00
5	admin	0001_initial	2022-06-13 06:23:17.066026+00
6	admin	0002_logentry_remove_auto_add	2022-06-13 06:23:17.755237+00
7	admin	0003_logentry_add_action_flag_choices	2022-06-13 06:23:18.67624+00
8	config_api	0002_influx	2022-06-13 06:43:52.635276+00
9	contenttypes	0002_remove_content_type_name	2022-06-13 06:46:14.278492+00
10	auth	0002_alter_permission_name_max_length	2022-06-13 06:46:14.725944+00
11	auth	0003_alter_user_email_max_length	2022-06-13 06:46:15.201903+00
12	auth	0004_alter_user_username_opts	2022-06-13 06:46:15.797216+00
13	auth	0005_alter_user_last_login_null	2022-06-13 06:46:16.255249+00
14	auth	0006_require_contenttypes_0002	2022-06-13 06:46:16.725394+00
15	auth	0007_alter_validators_add_error_messages	2022-06-13 06:46:17.176448+00
16	auth	0008_alter_user_username_max_length	2022-06-13 06:46:17.733079+00
17	auth	0009_alter_user_last_name_max_length	2022-06-13 06:46:18.198275+00
18	auth	0010_alter_group_name_max_length	2022-06-13 06:46:18.765882+00
19	auth	0011_update_proxy_permissions	2022-06-13 06:46:19.294306+00
20	auth	0012_alter_user_first_name_max_length	2022-06-13 06:46:19.789067+00
21	config_api	0003_influxsource_delete_influxdbconfig	2022-06-13 06:46:20.403781+00
22	config_api	0004_metricsource_description	2022-06-13 06:46:21.026401+00
23	sessions	0001_initial	2022-06-13 06:46:21.471202+00
24	config_api	0005_metricsource_icon_alter_metricsource_description	2022-06-13 06:54:58.672027+00
25	config_api	0006_metricsource_describe	2022-06-13 06:57:42.519473+00
26	config_api	0007_remove_metricsource_description_metricsource_image	2022-06-13 07:41:18.74882+00
27	config_api	0008_remove_metricsource_image_alter_metricsource_icon	2022-06-13 07:41:19.282292+00
28	config_api	0009_metricsource_description	2022-06-13 07:41:19.778052+00
29	config_api	0010_remove_metricsource_describe_and_more	2022-06-13 07:41:20.224024+00
30	config_api	0011_metricsource_icon	2022-06-13 07:41:20.800274+00
31	config_api	0012_metricsource_description	2022-06-13 07:43:25.713916+00
32	config_api	0013_metricsource_image	2022-06-13 07:44:58.405404+00
\.


--
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.django_session (session_key, session_data, expire_date) FROM stdin;
73mtpx0odg4q0zd5qrv3c9gnz4vgu2qg	.eJxVjMsOwiAQRf-FtSE8LAWX7vsNZJgZpGogKe3K-O_apAvd3nPOfYkI21ri1nmJM4mL0OL0uyXAB9cd0B3qrUlsdV3mJHdFHrTLqRE_r4f7d1Cgl289ZoaBstdoByY2QQMbQqXcCAbyoEFlMoGst2fH2Yfg0CI5SGiYtRfvDw2bOPQ:1noeo0:-qQOVlIVcCoVBTd11zoJtyUAUfagiez8kGyXizDFgIs	2022-05-25 05:22:36.228399+00
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

SELECT pg_catalog.setval('public.auth_permission_id_seq', 48, true);


--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.auth_user_groups_id_seq', 1, false);


--
-- Name: auth_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.auth_user_id_seq', 1, true);


--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.auth_user_user_permissions_id_seq', 1, false);


--
-- Name: config_api_configstring_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.config_api_configstring_id_seq', 5, true);


--
-- Name: config_api_influx_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.config_api_influx_id_seq', 1, false);


--
-- Name: config_api_influxsource_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.config_api_influxsource_id_seq', 1, true);


--
-- Name: config_api_metricsource_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.config_api_metricsource_id_seq', 7, true);


--
-- Name: config_api_promconfig_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.config_api_promconfig_id_seq', 1, true);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.django_admin_log_id_seq', 1, false);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.django_content_type_id_seq', 12, true);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.django_migrations_id_seq', 32, true);


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
-- Name: config_api_configstring config_api_configstring_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.config_api_configstring
    ADD CONSTRAINT config_api_configstring_pkey PRIMARY KEY (id);


--
-- Name: config_api_influx config_api_influx_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.config_api_influx
    ADD CONSTRAINT config_api_influx_pkey PRIMARY KEY (id);


--
-- Name: config_api_influxsource config_api_influxsource_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.config_api_influxsource
    ADD CONSTRAINT config_api_influxsource_pkey PRIMARY KEY (id);


--
-- Name: config_api_metricsource config_api_metricsource_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.config_api_metricsource
    ADD CONSTRAINT config_api_metricsource_pkey PRIMARY KEY (id);


--
-- Name: config_api_promconfig config_api_promconfig_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.config_api_promconfig
    ADD CONSTRAINT config_api_promconfig_pkey PRIMARY KEY (id);


--
-- Name: django_admin_log django_admin_log_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);


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
-- Name: django_session_expire_date_a5c62663; Type: INDEX; Schema: public; Owner: decdpdev
--

CREATE INDEX django_session_expire_date_a5c62663 ON public.django_session USING btree (expire_date);


--
-- Name: django_session_session_key_c0390e0f_like; Type: INDEX; Schema: public; Owner: decdpdev
--

CREATE INDEX django_session_session_key_c0390e0f_like ON public.django_session USING btree (session_key varchar_pattern_ops);


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

