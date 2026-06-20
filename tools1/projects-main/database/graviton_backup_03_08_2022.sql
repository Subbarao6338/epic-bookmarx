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
-- Name: Comment; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public."Comment" (
    id integer NOT NULL,
    sr_id character varying(100),
    comment character varying(100),
    status character varying(100),
    created_on timestamp without time zone,
    created_by character varying(100),
    updated_on timestamp without time zone,
    updated_by character varying(100)
);


ALTER TABLE public."Comment" OWNER TO decdpdev;

--
-- Name: Comment_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public."Comment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Comment_id_seq" OWNER TO decdpdev;

--
-- Name: Comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public."Comment_id_seq" OWNED BY public."Comment".id;


--
-- Name: DataSource; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public."DataSource" (
    id integer NOT NULL,
    datasource_name character varying(100),
    datasource_type character varying(100),
    connection_details character varying(1000),
    active_status bit(1),
    expiry_date date,
    tenant_id character varying(100),
    created_on timestamp without time zone,
    created_by character varying(100),
    updated_on timestamp without time zone,
    updated_by character varying(100)
);


ALTER TABLE public."DataSource" OWNER TO decdpdev;

--
-- Name: DataSource_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public."DataSource_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."DataSource_id_seq" OWNER TO decdpdev;

--
-- Name: DataSource_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public."DataSource_id_seq" OWNED BY public."DataSource".id;


--
-- Name: KubernetesCluster; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public."KubernetesCluster" (
    id integer NOT NULL,
    resource_name character varying(50) NOT NULL,
    kubernetes_name character varying(50) NOT NULL,
    node_count character varying(50) NOT NULL,
    aks_nodes_vm_type character varying(20),
    resource_location character varying(50) NOT NULL,
    environment character varying(20),
    project_name character varying(30) NOT NULL,
    lead_id integer,
    status character varying(50) NOT NULL
);


ALTER TABLE public."KubernetesCluster" OWNER TO decdpdev;

--
-- Name: KubernetesCluster_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public."KubernetesCluster_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."KubernetesCluster_id_seq" OWNER TO decdpdev;

--
-- Name: KubernetesCluster_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public."KubernetesCluster_id_seq" OWNED BY public."KubernetesCluster".id;


--
-- Name: Notifications; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public."Notifications" (
    id integer NOT NULL,
    user_name character varying(50),
    email_id character varying(100),
    page_name character varying(50),
    alert_msg character varying(100),
    alert_type character varying(50),
    created_on timestamp without time zone,
    display_status boolean
);


ALTER TABLE public."Notifications" OWNER TO decdpdev;

--
-- Name: Notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public."Notifications_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Notifications_id_seq" OWNER TO decdpdev;

--
-- Name: Notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public."Notifications_id_seq" OWNED BY public."Notifications".id;


--
-- Name: Organization; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public."Organization" (
    id integer NOT NULL,
    name character varying(100),
    details character varying(100),
    created_on timestamp without time zone,
    created_by character varying(100),
    updated_on timestamp without time zone,
    updated_by character varying(100)
);


ALTER TABLE public."Organization" OWNER TO decdpdev;

--
-- Name: Organization_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public."Organization_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Organization_id_seq" OWNER TO decdpdev;

--
-- Name: Organization_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public."Organization_id_seq" OWNED BY public."Organization".id;


--
-- Name: ProjectManagment; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public."ProjectManagment" (
    projid integer NOT NULL,
    projectname character varying(50) NOT NULL,
    status boolean,
    leadid integer NOT NULL,
    created_on timestamp without time zone,
    created_by character varying(100),
    updated_on timestamp without time zone,
    updated_by character varying(100)
);


ALTER TABLE public."ProjectManagment" OWNER TO decdpdev;

--
-- Name: ProjectManagment_projid_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public."ProjectManagment_projid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ProjectManagment_projid_seq" OWNER TO decdpdev;

--
-- Name: ProjectManagment_projid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public."ProjectManagment_projid_seq" OWNED BY public."ProjectManagment".projid;


--
-- Name: ProjectResource; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public."ProjectResource" (
    id integer NOT NULL,
    projid integer NOT NULL,
    aksclusterallocatedcount integer NOT NULL,
    aksnodesmaxlimit integer NOT NULL,
    aks_cluster_provisioned_count integer,
    aksnodesallowedvmtype character varying(500),
    aksallowedregions character varying(500)
);


ALTER TABLE public."ProjectResource" OWNER TO decdpdev;

--
-- Name: ProjectResource_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public."ProjectResource_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ProjectResource_id_seq" OWNER TO decdpdev;

--
-- Name: ProjectResource_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public."ProjectResource_id_seq" OWNED BY public."ProjectResource".id;


--
-- Name: Projects; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public."Projects" (
    projid integer NOT NULL,
    projectname character varying(50) NOT NULL,
    details character varying(500),
    resourcegroup character varying(500),
    status boolean,
    orgid integer NOT NULL,
    created_on timestamp without time zone,
    created_by character varying(100),
    updated_on timestamp without time zone,
    updated_by character varying(100),
    teamlead character varying(500)
);


ALTER TABLE public."Projects" OWNER TO decdpdev;

--
-- Name: ProjectsConfig; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public."ProjectsConfig" (
    id integer NOT NULL,
    projectname character varying(50) NOT NULL,
    acc_mail character varying(100),
    selected_on timestamp without time zone,
    selected_by character varying(100)
);


ALTER TABLE public."ProjectsConfig" OWNER TO decdpdev;

--
-- Name: ProjectsConfig_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public."ProjectsConfig_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ProjectsConfig_id_seq" OWNER TO decdpdev;

--
-- Name: ProjectsConfig_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public."ProjectsConfig_id_seq" OWNED BY public."ProjectsConfig".id;


--
-- Name: Projects_projid_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public."Projects_projid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Projects_projid_seq" OWNER TO decdpdev;

--
-- Name: Projects_projid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public."Projects_projid_seq" OWNED BY public."Projects".projid;


--
-- Name: ReportDetails; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public."ReportDetails" (
    report_type character varying(30),
    report_title character varying(100),
    report_url character varying,
    report_thumbnail character varying(300),
    report_provider character varying(50),
    id integer NOT NULL,
    status boolean
);


ALTER TABLE public."ReportDetails" OWNER TO decdpdev;

--
-- Name: Report_Details; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public."Report_Details" (
    report_type character varying(30),
    report_title character varying(100),
    report_url character varying,
    report_thumbnail character varying(300),
    report_provider character varying(50),
    id integer NOT NULL,
    status boolean
);


ALTER TABLE public."Report_Details" OWNER TO decdpdev;

--
-- Name: Resource; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public."Resource" (
    id integer NOT NULL,
    kubernate_cluster integer NOT NULL,
    node_per_cluster integer NOT NULL,
    vm_size character varying(100),
    aks_cluster character varying(100),
    created_on timestamp without time zone,
    created_by character varying(100),
    updated_on timestamp without time zone,
    updated_by character varying(100)
);


ALTER TABLE public."Resource" OWNER TO decdpdev;

--
-- Name: Resource_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public."Resource_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Resource_id_seq" OWNER TO decdpdev;

--
-- Name: Resource_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public."Resource_id_seq" OWNED BY public."Resource".id;


--
-- Name: Role; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public."Role" (
    role_id integer NOT NULL,
    role_name character varying(50) NOT NULL,
    role_desc character varying(500)
);


ALTER TABLE public."Role" OWNER TO decdpdev;

--
-- Name: Role_role_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public."Role_role_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Role_role_id_seq" OWNER TO decdpdev;

--
-- Name: Role_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public."Role_role_id_seq" OWNED BY public."Role".role_id;


--
-- Name: ServiceRequest; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public."ServiceRequest" (
    id integer NOT NULL,
    sr_id character varying(10),
    title character varying(100),
    description character varying,
    uploaded_files character varying,
    sr_status character varying(25),
    created_on timestamp without time zone,
    created_by character varying(100),
    updated_on timestamp without time zone,
    updated_by character varying(100)
);


ALTER TABLE public."ServiceRequest" OWNER TO decdpdev;

--
-- Name: ServiceRequest_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public."ServiceRequest_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ServiceRequest_id_seq" OWNER TO decdpdev;

--
-- Name: ServiceRequest_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public."ServiceRequest_id_seq" OWNED BY public."ServiceRequest".id;


--
-- Name: Settings; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public."Settings" (
    id integer NOT NULL,
    title character varying(100),
    storage_account character varying(100),
    azure_sql_instance character varying(100),
    service_principal character varying(100),
    airflow_url character varying(100),
    prefect_url character varying(100),
    notebook character varying(100),
    aion_url character varying(100),
    databricks character varying(100),
    powerbi character varying(100),
    druid character varying(100),
    kibana character varying(100),
    tenant_id character varying(100),
    created_on timestamp without time zone,
    created_by character varying(100),
    updated_on timestamp without time zone,
    updated_by character varying(100)
);


ALTER TABLE public."Settings" OWNER TO decdpdev;

--
-- Name: Settings_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public."Settings_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Settings_id_seq" OWNER TO decdpdev;

--
-- Name: Settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public."Settings_id_seq" OWNED BY public."Settings".id;


--
-- Name: UserRole; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public."UserRole" (
    id integer NOT NULL,
    user_id integer,
    role_id integer
);


ALTER TABLE public."UserRole" OWNER TO decdpdev;

--
-- Name: UserRole_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public."UserRole_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."UserRole_id_seq" OWNER TO decdpdev;

--
-- Name: UserRole_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public."UserRole_id_seq" OWNED BY public."UserRole".id;


--
-- Name: Users; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public."Users" (
    user_id integer NOT NULL,
    user_name character varying(50) NOT NULL,
    user_mail character varying(500),
    user_profile character varying(500),
    password character varying(500),
    emp_id character varying(30),
    role_id integer
);


ALTER TABLE public."Users" OWNER TO decdpdev;

--
-- Name: Users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public."Users_user_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Users_user_id_seq" OWNER TO decdpdev;

--
-- Name: Users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public."Users_user_id_seq" OWNED BY public."Users".user_id;


--
-- Name: recentlyviewed; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.recentlyviewed (
    id integer NOT NULL,
    assettype character varying(100),
    name character varying(100),
    url character varying(1000),
    created_on timestamp without time zone
);


ALTER TABLE public.recentlyviewed OWNER TO decdpdev;

--
-- Name: recentlyviewed_id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public.recentlyviewed_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.recentlyviewed_id_seq OWNER TO decdpdev;

--
-- Name: recentlyviewed_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public.recentlyviewed_id_seq OWNED BY public.recentlyviewed.id;


--
-- Name: Comment id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."Comment" ALTER COLUMN id SET DEFAULT nextval('public."Comment_id_seq"'::regclass);


--
-- Name: DataSource id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."DataSource" ALTER COLUMN id SET DEFAULT nextval('public."DataSource_id_seq"'::regclass);


--
-- Name: KubernetesCluster id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."KubernetesCluster" ALTER COLUMN id SET DEFAULT nextval('public."KubernetesCluster_id_seq"'::regclass);


--
-- Name: Notifications id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."Notifications" ALTER COLUMN id SET DEFAULT nextval('public."Notifications_id_seq"'::regclass);


--
-- Name: Organization id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."Organization" ALTER COLUMN id SET DEFAULT nextval('public."Organization_id_seq"'::regclass);


--
-- Name: ProjectManagment projid; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."ProjectManagment" ALTER COLUMN projid SET DEFAULT nextval('public."ProjectManagment_projid_seq"'::regclass);


--
-- Name: ProjectResource id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."ProjectResource" ALTER COLUMN id SET DEFAULT nextval('public."ProjectResource_id_seq"'::regclass);


--
-- Name: Projects projid; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."Projects" ALTER COLUMN projid SET DEFAULT nextval('public."Projects_projid_seq"'::regclass);


--
-- Name: ProjectsConfig id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."ProjectsConfig" ALTER COLUMN id SET DEFAULT nextval('public."ProjectsConfig_id_seq"'::regclass);


--
-- Name: Resource id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."Resource" ALTER COLUMN id SET DEFAULT nextval('public."Resource_id_seq"'::regclass);


--
-- Name: Role role_id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."Role" ALTER COLUMN role_id SET DEFAULT nextval('public."Role_role_id_seq"'::regclass);


--
-- Name: ServiceRequest id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."ServiceRequest" ALTER COLUMN id SET DEFAULT nextval('public."ServiceRequest_id_seq"'::regclass);


--
-- Name: Settings id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."Settings" ALTER COLUMN id SET DEFAULT nextval('public."Settings_id_seq"'::regclass);


--
-- Name: UserRole id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."UserRole" ALTER COLUMN id SET DEFAULT nextval('public."UserRole_id_seq"'::regclass);


--
-- Name: Users user_id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."Users" ALTER COLUMN user_id SET DEFAULT nextval('public."Users_user_id_seq"'::regclass);


--
-- Name: recentlyviewed id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.recentlyviewed ALTER COLUMN id SET DEFAULT nextval('public.recentlyviewed_id_seq'::regclass);


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public."Comment" (id, sr_id, comment, status, created_on, created_by, updated_on, updated_by) FROM stdin;
1	SR000001	average	In Progress	2022-05-05 18:09:43.529925	Pavithran A	\N	\N
2	SR000002	Created the VM 	Completed	2022-05-10 09:06:15.769888	Pavithran A	2022-05-10 09:06:39.869903	Pavithran A
3	SR000001	Comment need multi-line	In Progress	2022-05-31 07:19:23.542851	Pavithran A	\N	\N
4	SR000002	Comment....	Completed	2022-05-31 07:22:05.462608	Pavithran A	\N	\N
6	SR000021	YFVIY dyh	In Progress	2022-06-06 13:03:52.001289	Pavithran A	2022-06-06 14:40:35.721043	HCL ERS
5	SR000021	UGFJH	In Progress	2022-06-06 12:24:51.110529	Pavithran A	2022-06-06 15:00:53.331161	HCL ERS
8	SR000024	cdp	In Progress	2022-06-07 11:33:55.782555	Pavithran A	\N	\N
9	SR000024	dqc	In Progress	2022-06-07 11:34:23.266319	Pavithran A	\N	\N
10	SR000024	Collaboration Data Workspace	In Progress	2022-06-07 11:36:07.296089	Pavithran A	\N	\N
12	SR000024	Data Genie 	Completed	2022-06-07 11:38:15.150428	Pavithran A	\N	\N
13	SR000024	ads	In Progress	2022-06-07 12:25:09.008899	Pavithran A	\N	\N
14	SR000024	sql	Completed	2022-06-07 12:49:27.679057	Pavithran A	\N	\N
15	SR000024	swet	In Progress	2022-06-07 13:19:27.45443	Pavithran A	\N	\N
16	SR000024	FDJ	In Progress	2022-06-07 15:27:16.557099	Pavithran A	\N	\N
17	SR000024	HDTBZ	In Progress	2022-06-07 15:29:25.409293	Pavithran A	\N	\N
18	SR000024	mDWC	In Progress	2022-06-07 15:36:08.234471	Pavithran A	\N	\N
19	SR000024	sdfgd	Completed	2022-06-07 16:23:54.809891	Pavithran A	\N	\N
20	SR000041	Please share the configuration details	In Progress	2022-06-08 10:03:17.326157	hcl_ers@hcl.com	\N	\N
21	SR000041	Please provide graphics card details.	In Progress	2022-06-08 10:04:11.755712	hcl_ers@hcl.com	\N	\N
22	SR000041	Windows 11 not available	In Progress	2022-06-08 10:04:25.74045	hcl_ers@hcl.com	\N	\N
23	SR000041	Admin Access approval required	In Progress	2022-06-08 10:04:52.189301	hcl_ers@hcl.com	\N	\N
24	SR000041	Please use email id and password as a credential	Completed	2022-06-08 10:05:17.593717	hcl_ers@hcl.com	\N	\N
25	SR000042	Need to verify each cost	In Progress	2022-06-16 05:50:44.575404	hcl_ers@hcl.com	\N	\N
26	SR000025	Test Comment	In Progress	2022-06-16 11:38:21.400187	hcl_ers@hcl.com	\N	\N
\.


--
-- Data for Name: DataSource; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public."DataSource" (id, datasource_name, datasource_type, connection_details, active_status, expiry_date, tenant_id, created_on, created_by, updated_on, updated_by) FROM stdin;
\.


--
-- Data for Name: KubernetesCluster; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public."KubernetesCluster" (id, resource_name, kubernetes_name, node_count, aks_nodes_vm_type, resource_location, environment, project_name, lead_id, status) FROM stdin;
4	Graviton_kubernetes5	Graviton_kubernetes5_aks	2	\N	Central India	Development	TA	\N	
5	Graviton_kubernetes6	Graviton_kubernetes6_aks	2	\N	Central India	Development	r&D	\N	
6	Graviton_kubernetes8	Graviton_kubernetes8_aks	2	\N	Central India	Staging	R&D	\N	
7	Graviton_kubernetes_shee	Graviton_kubernetes_shee_aks	2	\N	Central India	Development	ERS	\N	
8	Graviton_kubernetes_shee7	Graviton_kubernetes_shee7_aks	2	\N	Central India	Staging	DE	\N	
9	Graviton_kubernetes	Graviton_kubernetes_aks	2	\N	Central India	Staging	teast	\N	
10	Graviton_shee	Graviton_shee_aks	2	\N	Central India	Production	DataScope	\N	
11	Graviton_kubernetes10	Graviton_kubernetes10_aks	2	\N	Central India	Development	R&D1	\N	
12	Graviton_kubernetes_h	Graviton_kubernetes_h_aks	2	\N	Central India	Development	R&D4	\N	In Progress
13	Graviton_kubernetes_shee07	Graviton_kubernetes_shee07_aks	2	\N	Central India	Development	ers data	\N	In Progress
14	Graviton_kubernetes_sheethal07	Graviton_kubernetes_sheethal07_aks	2	\N	Central India	Development	Hcl ers	\N	In Progress
15	Graviton_kubernetes_demo	Graviton_kubernetes_demo_aks	2	\N	Central India	Development	demo_project	\N	In Progress
16	Graviton_kubernetes_teju	Graviton_kubernetes_teju_aks	2	\N	Central India	Development	cdp	\N	In Progress
17	Graviton_kubernetes123	Graviton_kubernetes123_aks	2	\N	Central India	Development		\N	In-Progress
19	Graviton_kubernetes21	Graviton_kubernetes21_aks	2	\N	Central India	Development	p1	\N	In-Progress
20	Graviton_kubernetes2121	Graviton_kubernetes2121_aks	2	\N	Central India	Development	p12	\N	In-Progress
21	Graviton_kubernetes22	Graviton_kubernetes22_aks	2	\N	Central India	Development	p22	\N	Completed
23	Graviton_kubernetes12345	Graviton_kubernetes12345_aks	2	\N	Central India	Development	qwe1	\N	In-Progress
24	Graviton_kubernetesaks	Graviton_kubernetesaks_aks	2	\N	Central India	Development	qwe12	\N	In-Progress
25	Graviton_kubernetesaks12	Graviton_kubernetesaks12_aks	2	\N	Central India	Development	qwe1212	\N	In-Progress
26	Graviton_kubernetesaks122	Graviton_kubernetesaks122_aks	2	\N	Central India	Development	qwe12122	\N	Completed
27	Graviton_kubernetesaks1227	Graviton_kubernetesaks1227_aks	2	\N	Central India	Development	qwe121227	\N	In-Progress
28	Graviton_automated	Graviton_automated_aks	2	\N	Central India	Development	automated_deployment	\N	In-Progress
30	Graviton_Datascope1	Graviton_Datascope1_aks	2	\N	Central India	Staging	Graviton_Datascope1	\N	In-Progress
31	Graviton_Datascope10	Graviton_Datascope10_aks	2	\N	Central India	Staging	Graviton_Datascope10	\N	In-Progress
32	Graviton_Datascope11	Graviton_Datascope11_aks	2	\N	Central India	Staging	Graviton_Datascope11	\N	In-Progress
\.


--
-- Data for Name: Notifications; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public."Notifications" (id, user_name, email_id, page_name, alert_msg, alert_type, created_on, display_status) FROM stdin;
1	HCL ERS	hcl_ers@hcl.com	Organization	"HCL" Organization Created Successfully.	none	2022-04-07 06:18:44.052501	t
2	HCL ERS	hcl_ers@hcl.com	Organization	"HCL ERS" Organization Created Successfully.	none	2022-04-07 06:19:15.533579	t
5	HCL ERS	hcl_ers@hcl.com	Organization	"dssdsd" Organization Created Successfully.	none	2022-04-07 11:15:02.009647	f
6	HCL ERS	hcl_ers@hcl.com	Organization	"asas" Organization Created Successfully.	none	2022-04-07 11:54:36.113834	f
3	HCL ERS	hcl_ers@hcl.com	Organization	"HCL Practice" Organization Created Successfully.	none	2022-04-07 06:51:33.568215	f
4	HCL ERS	hcl_ers@hcl.com	Organization	"sas" Organization Created Successfully.	none	2022-04-07 06:52:19.540861	f
7	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"Service request" Service Request Created Successfully.	none	2022-05-05 18:08:15.059238	t
8	HCL ERS	hcl_ers@hcl.com	Service Request Details	"average" Comment Created Successfully.	none	2022-05-05 18:09:49.237744	t
9	de	de@hclazurecloudconnect.onmicrosoft.com	Organization	"asas" Organization Deleted Successfully.	none	2022-05-06 04:06:14.089303	t
10	de	de@hclazurecloudconnect.onmicrosoft.com	Organization	"dssdsd" Organization Deleted Successfully.	none	2022-05-06 04:06:26.633073	t
11	Pavithran A	PavithranA.Pa@hcl.com	Organization	"sas" Organization Deleted Successfully.	none	2022-05-10 09:02:38.838976	t
12	Pavithran A	PavithranA.Pa@hcl.com	Projects	"Graviton Project" Project Created Successfully.	none	2022-05-10 09:03:51.138957	t
13	Pavithran A	PavithranA.Pa@hcl.com	ServiceRequest	"Linux VM" Service Request Created Successfully.	none	2022-05-10 09:05:27.968919	t
14	Pavithran A	PavithranA.Pa@hcl.com	Service Request Details	"Creating the VM" Comment Created Successfully.	none	2022-05-10 09:06:19.476871	t
15	Pavithran A	PavithranA.Pa@hcl.com	Service Request Details	"Created the VM " Service Request  Details Updated Successfully.	none	2022-05-10 09:06:44.973909	t
16	Dinesh Babu Ramakrishnan - ERS, HCL Tech	dineshbr@hcl.com	Organization	"HCL Practice" Organization Updated Successfully.	none	2022-05-10 09:42:43.581442	t
17	Dinesh Babu Ramakrishnan - ERS, HCL Tech	dineshbr@hcl.com	Projects	"Graviton Project" Project Updated Successfully.	none	2022-05-10 09:43:09.800316	t
18	HCL ERS	hcl_ers@hcl.com	Projects	"Graviton Project" Project Updated Successfully.	none	2022-05-12 10:28:08.880065	t
20	Pavithran A	PavithranA.Pa@hcl.com	Projects	"Hawkeye" Project Updated Successfully.	none	2022-05-12 05:43:24.803791	f
21	HCL ERS	hcl_ers@hcl.com	Organization	"Research and Development" Organization Created Successfully.	none	2022-05-23 16:41:54.883511	t
22	HCL ERS	hcl_ers@hcl.com	Organization	"HCL Technologies" Organization Created Successfully.	none	2022-05-23 16:43:30.6009	t
23	HCL ERS	hcl_ers@hcl.com	Organization	"HCL Practice" Organization Deleted Successfully.	none	2022-05-23 16:43:44.35645	t
24	HCL ERS	hcl_ers@hcl.com	Projects	"Data workspace" Project Created Successfully.	none	2022-05-23 16:46:48.084064	t
25	HCL ERS	hcl_ers@hcl.com	Projects	"Hawkeye" Project Deleted Successfully.	none	2022-05-23 16:47:10.349428	t
26	HCL ERS	hcl_ers@hcl.com	Projects	"Snowflake" Project Created Successfully.	none	2022-05-23 16:51:32.784548	t
27	HCL ERS	hcl_ers@hcl.com	Projects	"Snowflake" Project Updated Successfully.	none	2022-05-23 16:52:12.189765	t
28	HCL ERS	hcl_ers@hcl.com	Organization	"HCL ERS" Organization Updated Successfully.	none	2022-05-23 16:53:46.145581	t
29	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"Service request" Service Request Updated Successfully.	none	2022-05-31 07:17:01.693552	t
30	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"Service request" Service Request Updated Successfully.	none	2022-05-31 07:17:13.150311	t
31	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"Service request" Service Request Updated Successfully.	none	2022-05-31 07:17:13.489463	t
32	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"Linux VM1" Service Request Updated Successfully.	none	2022-05-31 07:17:27.637911	t
33	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"Linux VM1" Service Request Updated Successfully.	none	2022-05-31 07:17:28.058654	t
34	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"Service Request Number 1" Service Request Created Successfully.	none	2022-05-31 07:18:37.186328	t
35	HCL ERS	hcl_ers@hcl.com	Service Request Details	"Comment need multi-line" Comment Created Successfully.	none	2022-05-31 07:19:24.292748	t
36	HCL ERS	hcl_ers@hcl.com	Service Request Details	"Comment...." Comment Created Successfully.	none	2022-05-31 07:22:06.258335	t
37	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"Linux VM1" Service Request Deleted Successfully.	none	2022-05-31 07:22:29.699108	t
38	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"Service request" Service Request Deleted Successfully.	none	2022-05-31 07:22:39.798286	t
39	Pavithran A	PavithranA.Pa@hcl.com	Projects	"Snowflake 1" Project Updated Successfully.	none	2022-06-01 04:59:57.259779	t
40	Pavithran A	PavithranA.Pa@hcl.com	Projects	"Snowflake" Project Updated Successfully.	none	2022-06-01 05:00:16.743266	t
41	Pavithran A	PavithranA.Pa@hcl.com	ServiceRequest	"Service Request Number" Service Request Updated Successfully.	none	2022-06-01 05:13:26.170356	t
42	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service" Service Request Created Successfully.	none	2022-06-01 11:39:00.653962	t
43	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"sheethal" Service Request Created Successfully.	none	2022-06-01 11:52:52.432371	t
44	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"sheethal" Service Request Deleted Successfully.	none	2022-06-01 12:23:12.232295	t
45	HCL ERS	hcl_ers@hcl.com	Projects	"cdp" Project Created Successfully.	none	2022-06-01 12:44:18.69755	t
46	HCL ERS	hcl_ers@hcl.com	Projects	"cdp" Project Deleted Successfully.	none	2022-06-01 12:44:37.879508	t
47	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"teju" Service Request Created Successfully.	none	2022-06-01 15:56:50.908168	t
48	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"gahj" Service Request Created Successfully.	none	2022-06-01 16:15:11.876715	t
49	HCL ERS	hcl_ers@hcl.com	Projects	"Snow" Project Updated Successfully.	none	2022-06-01 16:22:24.449311	t
50	HCL ERS	hcl_ers@hcl.com	Projects	"Snow" Project Deleted Successfully.	none	2022-06-01 16:35:02.283285	t
51	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"hello" Service Request Created Successfully.	none	2022-06-01 16:40:51.75297	t
52	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"hello" Service Request Deleted Successfully.	none	2022-06-01 16:41:24.756939	t
53	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"gahj" Service Request Deleted Successfully.	none	2022-06-01 16:41:40.23929	t
54	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"bnm," Service Request Created Successfully.	none	2022-06-01 16:51:00.341809	t
55	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"DataWork space" Service Request Created Successfully.	none	2022-06-01 16:57:32.425652	t
56	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"bnm," Service Request Deleted Successfully.	none	2022-06-01 16:57:49.853927	t
57	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"teju" Service Request Deleted Successfully.	none	2022-06-01 16:58:05.39877	t
58	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"heeee" Service Request Created Successfully.	none	2022-06-01 17:20:37.032939	t
59	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"dfghjk" Service Request Created Successfully.	none	2022-06-01 17:36:42.408587	t
60	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"ertyui" Service Request Created Successfully.	none	2022-06-01 17:37:33.216377	t
61	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"dfghjkl;" Service Request Created Successfully.	none	2022-06-01 17:52:06.97344	t
62	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"deepu" Service Request Created Successfully.	none	2022-06-01 18:24:09.382123	t
63	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"test_sr" Service Request Created Successfully.	none	2022-06-01 19:04:03.150659	t
64	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"test_sr" Service Request Deleted Successfully.	none	2022-06-01 19:09:18.35003	t
65	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"deepu" Service Request Deleted Successfully.	none	2022-06-01 19:09:34.881901	t
66	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"dfghjkl;" Service Request Deleted Successfully.	none	2022-06-01 19:09:49.600959	t
67	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"heeee" Service Request Deleted Successfully.	none	2022-06-01 19:10:09.54676	t
68	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"dfghjk" Service Request Deleted Successfully.	none	2022-06-01 19:10:27.773176	t
69	HCL ERS	hcl_ers@hcl.com	Projects	"Snowflake" Project Created Successfully.	none	2022-06-01 20:34:20.653689	t
70	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"ertyui" Service Request Deleted Successfully.	none	2022-06-02 08:38:55.849449	t
71	HCL ERS	hcl_ers@hcl.com	Projects	"iuashoijfoi" Project Created Successfully.	none	2022-06-02 07:52:46.534034	t
72	HCL ERS	hcl_ers@hcl.com	Projects	"fgds" Project Created Successfully.	none	2022-06-02 14:52:18.248848	t
73	HCL ERS	hcl_ers@hcl.com	Projects	"fgds" Project Updated Successfully.	none	2022-06-02 14:52:58.41499	t
74	HCL ERS	hcl_ers@hcl.com	Projects	"iuashoijfoi" Project Deleted Successfully.	none	2022-06-02 14:53:12.781801	t
75	HCL ERS	hcl_ers@hcl.com	Projects	"sql" Project Created Successfully.	none	2022-06-02 14:56:52.409639	t
76	HCL ERS	hcl_ers@hcl.com	Projects	"fgds" Project Updated Successfully.	none	2022-06-02 14:57:24.182499	t
77	HCL ERS	hcl_ers@hcl.com	Projects	"fgds" Project Deleted Successfully.	none	2022-06-02 14:57:37.007948	t
78	HCL ERS	hcl_ers@hcl.com	Projects	"DQC" Project Created Successfully.	none	2022-06-02 16:30:15.902559	t
79	HCL ERS	hcl_ers@hcl.com	Projects	"Research and Development" Project Created Successfully.	none	2022-06-02 16:32:52.704469	t
80	HCL ERS	hcl_ers@hcl.com	Projects	"Research and Development" Project Updated Successfully.	none	2022-06-02 16:33:50.356802	t
81	HCL ERS	hcl_ers@hcl.com	Projects	"sql" Project Deleted Successfully.	none	2022-06-02 16:36:24.067596	t
82	HCL ERS	hcl_ers@hcl.com	Projects	"DQC" Project Deleted Successfully.	none	2022-06-03 13:45:50.988092	t
83	HCL ERS	hcl_ers@hcl.com	Projects	"Research and Development" Project Updated Successfully.	none	2022-06-03 14:01:13.731208	t
84	HCL ERS	hcl_ers@hcl.com	Projects	"cdp" Project Created Successfully.	none	2022-06-03 14:02:39.333842	t
85	HCL ERS	hcl_ers@hcl.com	Projects	"cdp" Project Updated Successfully.	none	2022-06-03 14:04:01.619693	t
86	HCL ERS	hcl_ers@hcl.com	Projects	"mysql" Project Created Successfully.	none	2022-06-03 14:33:21.054996	t
87	HCL ERS	hcl_ers@hcl.com	Projects	"mysql" Project Updated Successfully.	none	2022-06-03 14:34:06.958202	t
88	HCL ERS	hcl_ers@hcl.com	Projects	"cdp" Project Deleted Successfully.	none	2022-06-03 14:34:29.516824	t
89	HCL ERS	hcl_ers@hcl.com	Projects	"mysql" Project Updated Successfully.	none	2022-06-03 10:47:40.545793	t
90	HCL ERS	hcl_ers@hcl.com	Projects	"erss" Project Created Successfully.	none	2022-06-03 18:02:54.475478	t
91	HCL ERS	hcl_ers@hcl.com	Projects	"mysql" Project Created Successfully.	none	2022-06-03 18:05:48.826951	t
92	HCL ERS	hcl_ers@hcl.com	Projects	"erss" Project Updated Successfully.	none	2022-06-03 18:08:17.081589	t
93	HCL ERS	hcl_ers@hcl.com	Projects	"erss" Project Deleted Successfully.	none	2022-06-03 18:09:49.473757	t
94	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"hlknb" Service Request Created Successfully.	none	2022-06-06 10:18:49.749328	t
95	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"hlknb" Service Request Deleted Successfully.	none	2022-06-06 10:20:29.587168	t
96	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"SR request" Service Request Created Successfully.	none	2022-06-06 10:53:02.458872	t
97	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"abs" Service Request Created Successfully.	none	2022-06-06 10:53:43.174041	t
98	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"abs" Service Request Deleted Successfully.	none	2022-06-06 10:54:03.080641	t
99	HCL ERS	hcl_ers@hcl.com	Projects	"dqc" Project Created Successfully.	none	2022-06-06 10:59:03.288874	t
100	HCL ERS	hcl_ers@hcl.com	Organization	"Tcs" Organization Created Successfully.	none	2022-06-06 11:08:47.150649	t
101	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"SDCS" Service Request Created Successfully.	none	2022-06-06 11:17:10.21927	t
102	HCL ERS	hcl_ers@hcl.com	Projects	"GYFC" Project Created Successfully.	none	2022-06-06 11:18:05.012412	t
103	HCL ERS	hcl_ers@hcl.com	Projects	"dqc" Project Deleted Successfully.	none	2022-06-06 11:18:19.726785	t
104	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"feedf" Service Request Created Successfully.	none	2022-06-06 12:24:28.016852	t
105	HCL ERS	hcl_ers@hcl.com	Service Request Details	"UGFJH" Comment Created Successfully.	none	2022-06-06 12:24:56.430156	t
106	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"feedf" Service Request Deleted Successfully.	none	2022-06-06 12:48:33.823452	t
107	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"FFDJ" Service Request Created Successfully.	none	2022-06-06 13:02:55.335475	t
108	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"IIHI" Service Request Created Successfully.	none	2022-06-06 13:03:19.771593	t
109	HCL ERS	hcl_ers@hcl.com	Service Request Details	"YFVIY" Comment Created Successfully.	none	2022-06-06 13:03:57.05861	t
110	HCL ERS	hcl_ers@hcl.com	Service Request Details	"UIFYVH" Comment Created Successfully.	none	2022-06-06 13:04:29.542623	t
111	HCL ERS	hcl_ers@hcl.com	Projects	"GYFC" Project Deleted Successfully.	none	2022-06-06 13:08:02.100304	t
112	HCL ERS	hcl_ers@hcl.com	Projects	"CDP" Project Created Successfully.	none	2022-06-06 13:10:13.817049	t
113	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service" Service Request Created Successfully.	none	2022-06-06 13:13:00.801807	t
114	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"request" Service Request Created Successfully.	none	2022-06-06 13:13:32.202408	t
115	HCL ERS	hcl_ers@hcl.com	Service Request Details	"UIFYVH" Service Request Details Updated Successfully.	none	2022-06-06 14:40:03.945841	t
116	HCL ERS	hcl_ers@hcl.com	Service Request Details	"UIFYVH" Service Request Comment Deleted Successfully.	none	2022-06-06 14:40:20.100896	t
117	HCL ERS	hcl_ers@hcl.com	Service Request Details	"YFVIY dyh" Service Request Details Updated Successfully.	none	2022-06-06 14:40:41.906829	t
118	HCL ERS	hcl_ers@hcl.com	Service Request Details	"YFVIY dyh" Service Request Details Updated Successfully.	none	2022-06-06 14:40:42.183877	t
119	HCL ERS	hcl_ers@hcl.com	Service Request Details	"UGFJH" Service Request Details Updated Successfully.	none	2022-06-06 14:59:42.98918	t
120	HCL ERS	hcl_ers@hcl.com	Service Request Details	"UGFJH" Service Request Details Updated Successfully.	none	2022-06-06 15:01:00.262532	t
121	HCL ERS	hcl_ers@hcl.com	Service Request Details	"UGFJH" Service Request Details Updated Successfully.	none	2022-06-06 15:01:00.575664	t
122	HCL ERS	hcl_ers@hcl.com	Organization	"HCL ERS R&D" Organization Created Successfully.	none	2022-06-06 09:57:07.935651	t
123	HCL ERS	hcl_ers@hcl.com	Organization	"HCL ERS R&D" Organization Created Successfully.	none	2022-06-06 09:58:14.522732	t
124	HCL ERS	hcl_ers@hcl.com	Organization	"HCL ERS R&D" Organization Updated Successfully.	none	2022-06-06 09:58:41.052924	t
125	Pavithran A	PavithranA.Pa@hcl.com	Projects	"Graviton Project" Project Created Successfully.	none	2022-06-06 10:21:47.410342	t
126	Pavithran A	PavithranA.Pa@hcl.com	Projects	"Graviton DataGenie" Project Created Successfully.	none	2022-06-06 10:37:11.181053	t
127	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"FFDJ" Service Request Deleted Successfully.	none	2022-06-06 17:43:54.082627	t
128	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"IIHI" Service Request Deleted Successfully.	none	2022-06-06 17:44:15.164336	t
129	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"Graviton" Service Request Created Successfully.	none	2022-06-06 19:25:18.50199	t
130	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"hcl" Service Request Created Successfully.	none	2022-06-06 20:35:30.244073	t
131	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"teju" Service Request Created Successfully.	none	2022-06-06 20:46:41.149833	t
132	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"teju" Service Request Deleted Successfully.	none	2022-06-06 20:50:23.359529	t
133	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"hcl" Service Request Deleted Successfully.	none	2022-06-06 20:50:40.987583	t
134	HCL ERS	hcl_ers@hcl.com	Service Request Details	"cdp" Comment Created Successfully.	none	2022-06-07 11:34:03.081214	t
135	HCL ERS	hcl_ers@hcl.com	Service Request Details	"dqc" Comment Created Successfully.	none	2022-06-07 11:34:30.426381	t
136	HCL ERS	hcl_ers@hcl.com	Service Request Details	"Collaboration Data Workspace" Comment Created Successfully.	none	2022-06-07 11:36:12.690655	t
137	HCL ERS	hcl_ers@hcl.com	Service Request Details	"Data Genie " Comment Created Successfully.	none	2022-06-07 11:36:51.983433	t
138	HCL ERS	hcl_ers@hcl.com	Service Request Details	"Data Genie " Service Request Details Updated Successfully.	none	2022-06-07 11:37:32.960927	t
139	HCL ERS	hcl_ers@hcl.com	Service Request Details	"Data Genie " Service Request Details Updated Successfully.	none	2022-06-07 11:37:33.201303	t
141	HCL ERS	hcl_ers@hcl.com	Service Request Details	"Data Genie " Comment Created Successfully.	none	2022-06-07 11:38:20.520893	t
142	HCL ERS	hcl_ers@hcl.com	Service Request Details	"ads" Comment Created Successfully.	none	2022-06-07 12:25:14.098741	t
143	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"HCL SEZ Bangalore" Service Request Created Successfully.	none	2022-06-07 12:31:00.706847	t
144	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"hcl" Service Request Created Successfully.	none	2022-06-07 12:35:34.057844	t
145	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"hcl" Service Request Deleted Successfully.	none	2022-06-07 12:36:54.863344	t
146	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"gjuh" Service Request Created Successfully.	none	2022-06-07 12:37:46.847803	t
147	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"ghsbg" Service Request Created Successfully.	none	2022-06-07 12:48:31.991791	t
148	HCL ERS	hcl_ers@hcl.com	Service Request Details	"sql" Comment Created Successfully.	none	2022-06-07 12:49:33.521861	t
149	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"cvb" Service Request Created Successfully.	none	2022-06-07 12:50:14.385876	t
150	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"cvb" Service Request Deleted Successfully.	none	2022-06-07 12:50:35.623706	t
151	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"ghsbg" Service Request Deleted Successfully.	none	2022-06-07 12:50:52.471537	t
152	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"fhsgh" Service Request Created Successfully.	none	2022-06-07 12:58:33.292391	t
153	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"wsdf" Service Request Created Successfully.	none	2022-06-07 13:00:24.583392	t
154	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"asdqw" Service Request Created Successfully.	none	2022-06-07 13:01:27.622366	t
155	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"asdqw" Service Request Deleted Successfully.	none	2022-06-07 13:01:48.919425	t
156	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"wsdf" Service Request Deleted Successfully.	none	2022-06-07 13:02:08.581799	t
157	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"fhsgh" Service Request Deleted Successfully.	none	2022-06-07 13:02:28.577459	t
158	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"gjuh" Service Request Deleted Successfully.	none	2022-06-07 13:02:46.325146	t
159	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"dfghjk" Service Request Created Successfully.	none	2022-06-07 13:18:18.152033	t
160	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"dfghjk" Service Request Deleted Successfully.	none	2022-06-07 13:18:36.983327	t
161	HCL ERS	hcl_ers@hcl.com	Service Request Details	"swet" Comment Created Successfully.	none	2022-06-07 13:19:32.542585	t
162	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"HCL Hyd" Service Request Created Successfully.	none	2022-06-07 08:09:59.625684	t
163	Pavithran A	PavithranA.Pa@hcl.com	Projects	"DQC " Project Created Successfully.	none	2022-06-07 08:19:27.611991	t
164	Pavithran A	PavithranA.Pa@hcl.com	Projects	"DQC " Project Updated Successfully.	none	2022-06-07 08:19:43.455209	t
165	Pavithran A	PavithranA.Pa@hcl.com	Projects	"DQC " Project Updated Successfully.	none	2022-06-07 08:20:20.201435	t
166	HCL ERS	hcl_ers@hcl.com	Service Request Details	"FDJ" Comment Created Successfully.	none	2022-06-07 15:27:23.052579	t
167	HCL ERS	hcl_ers@hcl.com	Service Request Details	"HDTBZ" Comment Created Successfully.	none	2022-06-07 15:29:31.35199	t
168	HCL ERS	hcl_ers@hcl.com	Service Request Details	"mDWC" Comment Created Successfully.	none	2022-06-07 15:36:15.11728	t
169	HCL ERS	hcl_ers@hcl.com	Service Request Details	"sdfgd" Comment Created Successfully.	none	2022-06-07 16:24:00.752979	t
170	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"xcvbjk" Service Request Created Successfully.	none	2022-06-07 17:08:35.91206	t
171	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"xcvbjk" Service Request Deleted Successfully.	none	2022-06-07 17:09:00.625975	t
172	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service" Service Request Created Successfully.	none	2022-06-07 17:27:56.778806	t
173	Pavithran A	PavithranA.Pa@hcl.com	ServiceRequest	"service" Service Request Updated Successfully.	none	2022-06-07 12:05:49.310153	t
174	Pavithran A	PavithranA.Pa@hcl.com	ServiceRequest	"service" Service Request Updated Successfully.	none	2022-06-07 12:07:40.287671	t
175	Pavithran A	PavithranA.Pa@hcl.com	ServiceRequest	"service" Service Request Updated Successfully.	none	2022-06-07 12:08:07.544449	t
176	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service1" Service Request Updated Successfully.	none	2022-06-07 17:45:19.016189	t
177	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request" Service Request Updated Successfully.	none	2022-06-07 17:49:03.034102	t
178	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request" Service Request Updated Successfully.	none	2022-06-07 17:49:27.810174	t
179	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request2" Service Request Updated Successfully.	none	2022-06-07 18:10:28.058969	t
180	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request2" Service Request Updated Successfully.	none	2022-06-07 18:11:55.807056	t
181	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"HCL Hyd" Service Request Deleted Successfully.	none	2022-06-07 18:40:19.180818	t
182	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request3" Service Request Updated Successfully.	none	2022-06-07 19:06:05.914599	t
183	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request3" Service Request Updated Successfully.	none	2022-06-07 19:06:06.161872	t
184	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request1" Service Request Updated Successfully.	none	2022-06-08 08:43:13.683974	t
185	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request2" Service Request Updated Successfully.	none	2022-06-08 08:57:54.941085	t
186	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request2" Service Request Updated Successfully.	none	2022-06-08 08:57:55.151085	t
187	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request3" Service Request Updated Successfully.	none	2022-06-08 09:06:24.983784	t
188	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request3" Service Request Updated Successfully.	none	2022-06-08 09:06:25.197723	t
189	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request1" Service Request Updated Successfully.	none	2022-06-08 09:13:17.105166	t
190	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request1" Service Request Updated Successfully.	none	2022-06-08 09:13:17.320165	t
191	HCL ERS	hcl_ers@hcl.com	Organization	"HCL ERS R&D" Organization Updated Successfully.	none	2022-06-08 09:19:40.814447	t
192	HCL ERS	hcl_ers@hcl.com	Organization	"HCL ERS R&D" Organization Updated Successfully.	none	2022-06-08 09:52:29.667375	t
193	HCL ERS	hcl_ers@hcl.com	Projects	"DQC " Project Updated Successfully.	none	2022-06-08 10:41:39.982405	t
194	HCL ERS	hcl_ers@hcl.com	Projects	"Graviton DataGenie" Project Updated Successfully.	none	2022-06-08 10:42:24.218436	t
195	HCL ERS	hcl_ers@hcl.com	Organization	"HCL ERS R&D" Organization Updated Successfully.	none	2022-06-08 11:04:32.125903	t
196	HCL ERS	hcl_ers@hcl.com	Projects	"DQC " Project Updated Successfully.	none	2022-06-08 11:21:59.292496	t
197	HCL ERS	hcl_ers@hcl.com	Organization	"HCL ERS R&D " Organization Updated Successfully.	none	2022-06-08 11:23:16.340036	t
198	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request2" Service Request Updated Successfully.	none	2022-06-08 12:24:18.611332	t
199	HCL ERS	hcl_ers@hcl.com	Organization	"HCL ERS R&D " Organization Updated Successfully.	none	2022-06-08 12:26:46.839306	t
200	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request" Service Request Updated Successfully.	none	2022-06-08 12:27:52.613974	t
201	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request" Service Request Updated Successfully.	none	2022-06-08 12:27:52.822309	t
202	HCL ERS	hcl_ers@hcl.com	Organization	"HCL ERS R&D " Organization Updated Successfully.	none	2022-06-08 12:28:39.621056	t
203	HCL ERS	hcl_ers@hcl.com	Organization	"HCL ERS R&D " Organization Updated Successfully.	none	2022-06-08 12:29:48.122192	t
204	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request1" Service Request Updated Successfully.	none	2022-06-08 12:32:18.562349	t
205	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request1" Service Request Updated Successfully.	none	2022-06-08 12:32:18.826529	t
206	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request" Service Request Updated Successfully.	none	2022-06-08 12:34:15.956909	t
207	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request1" Service Request Updated Successfully.	none	2022-06-08 12:39:33.953803	t
208	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request1" Service Request Updated Successfully.	none	2022-06-08 12:39:34.265457	t
209	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request1" Service Request Updated Successfully.	none	2022-06-08 12:39:34.710931	t
210	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request1" Service Request Updated Successfully.	none	2022-06-08 12:39:35.079608	t
211	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request1" Service Request Updated Successfully.	none	2022-06-08 12:39:35.753516	t
212	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request1" Service Request Updated Successfully.	none	2022-06-08 12:39:35.982466	t
213	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request1" Service Request Updated Successfully.	none	2022-06-08 12:39:36.485548	t
214	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request1" Service Request Updated Successfully.	none	2022-06-08 12:39:36.745296	t
215	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request1" Service Request Updated Successfully.	none	2022-06-08 12:39:37.329328	t
216	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request1" Service Request Updated Successfully.	none	2022-06-08 12:39:37.449299	t
217	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request" Service Request Updated Successfully.	none	2022-06-08 12:48:55.520504	t
218	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request" Service Request Updated Successfully.	none	2022-06-08 12:48:55.518503	t
219	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request" Service Request Updated Successfully.	none	2022-06-08 12:48:55.503506	t
220	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request" Service Request Updated Successfully.	none	2022-06-08 12:48:55.521509	t
221	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request" Service Request Updated Successfully.	none	2022-06-08 12:48:55.505503	t
222	HCL ERS	hcl_ers@hcl.com	Organization	"HCL ERS R&D " Organization Updated Successfully.	none	2022-06-08 12:50:39.260859	t
223	HCL ERS	hcl_ers@hcl.com	Organization	"HCL ERS R&D " Organization Updated Successfully.	none	2022-06-08 13:06:30.425304	t
224	HCL ERS	hcl_ers@hcl.com	Organization	"HCL ERS R&D " Organization Updated Successfully.	none	2022-06-08 13:07:25.095134	t
225	Pavithran A	PavithranA.Pa@hcl.com	Organization	"HCL ERS R&D " Organization Updated Successfully.	none	2022-06-08 07:59:48.237442	t
226	Pavithran A	PavithranA.Pa@hcl.com	Organization	"HCL ERS R&D " Organization Updated Successfully.	none	2022-06-08 08:00:13.641281	t
227	Pavithran A	PavithranA.Pa@hcl.com	Organization	"HCL ERS R&D " Organization Updated Successfully.	none	2022-06-08 08:01:30.240583	t
228	HCL ERS	hcl_ers@hcl.com	Projects	"DQC " Project Updated Successfully.	none	2022-06-08 14:09:30.276436	t
229	HCL ERS	hcl_ers@hcl.com	Organization	"HCL ERS R&D " Organization Updated Successfully.	none	2022-06-08 14:11:24.924896	t
230	HCL ERS	hcl_ers@hcl.com	Projects	"Anomaly Detection" Project Created Successfully.	none	2022-06-08 09:58:20.850711	t
231	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"Windows VM " Service Request Created Successfully.	none	2022-06-08 10:02:14.48223	t
232	HCL ERS	hcl_ers@hcl.com	Service Request Details	"Please share the configuration details" Comment Created Successfully.	none	2022-06-08 10:03:18.092138	t
233	HCL ERS	hcl_ers@hcl.com	Service Request Details	"Please provide graphics card details." Comment Created Successfully.	none	2022-06-08 10:04:12.451279	t
234	HCL ERS	hcl_ers@hcl.com	Service Request Details	"Windows 11 not available" Comment Created Successfully.	none	2022-06-08 10:04:26.458525	t
235	HCL ERS	hcl_ers@hcl.com	Service Request Details	"Admin Access approval required" Comment Created Successfully.	none	2022-06-08 10:04:53.013007	t
236	HCL ERS	hcl_ers@hcl.com	Service Request Details	"Please use email id and password as a credential" Comment Created Successfully.	none	2022-06-08 10:05:18.434839	t
253	Pavithran A	PavithranA.Pa@hcl.com	Projects	"DataGenie Version 2" Project Created Successfully.	none	2022-06-09 08:06:34.834343	t
252	HCL ERS	hcl_ers@hcl.com	Projects	"ERS Research - Project 1" Project Created Successfully.	none	2022-06-08 10:41:05.659623	f
251	HCL ERS	hcl_ers@hcl.com	Organization	"HCL Technologies Limited" Organization Created Successfully.	none	2022-06-08 10:39:46.590907	f
254	Pavithran A	PavithranA.Pa@hcl.com	ServiceRequest	"request" Service Request Updated Successfully.	none	2022-06-15 05:52:31.014584	t
255	Pavithran A	PavithranA.Pa@hcl.com	ServiceRequest	"request" Service Request Updated Successfully.	none	2022-06-15 05:54:03.317862	t
256	Pavithran A	PavithranA.Pa@hcl.com	ServiceRequest	"request" Service Request Updated Successfully.	none	2022-06-15 05:54:03.638875	t
257	Pavithran A	PavithranA.Pa@hcl.com	ServiceRequest	"request" Service Request Updated Successfully.	none	2022-06-15 05:54:03.860885	t
258	Pavithran A	PavithranA.Pa@hcl.com	ServiceRequest	"request" Service Request Updated Successfully.	none	2022-06-15 05:54:04.110867	t
259	Pavithran A	PavithranA.Pa@hcl.com	ServiceRequest	"request" Service Request Updated Successfully.	none	2022-06-15 05:54:04.233896	t
260	Pavithran A	PavithranA.Pa@hcl.com	ServiceRequest	"request" Service Request Updated Successfully.	none	2022-06-15 05:54:04.493544	t
261	Pavithran A	PavithranA.Pa@hcl.com	ServiceRequest	"request" Service Request Updated Successfully.	none	2022-06-15 05:54:05.13154	t
262	Pavithran A	PavithranA.Pa@hcl.com	ServiceRequest	"request" Service Request Updated Successfully.	none	2022-06-15 05:54:05.458536	t
263	Pavithran A	PavithranA.Pa@hcl.com	ServiceRequest	"request" Service Request Updated Successfully.	none	2022-06-15 05:54:05.676525	t
264	Pavithran A	PavithranA.Pa@hcl.com	ServiceRequest	"request" Service Request Updated Successfully.	none	2022-06-15 05:54:05.939573	t
265	Pavithran A	PavithranA.Pa@hcl.com	ServiceRequest	"request" Service Request Updated Successfully.	none	2022-06-15 06:02:01.082985	t
266	Pavithran A	PavithranA.Pa@hcl.com	ServiceRequest	"request" Service Request Updated Successfully.	none	2022-06-15 06:10:41.011735	t
267	Pavithran A	PavithranA.Pa@hcl.com	ServiceRequest	"request" Service Request Updated Successfully.	none	2022-06-15 06:13:11.055165	t
268	Pavithran A	PavithranA.Pa@hcl.com	ServiceRequest	"request" Service Request Updated Successfully.	none	2022-06-15 06:13:28.836459	t
269	Pavithran A	PavithranA.Pa@hcl.com	ServiceRequest	"request" Service Request Updated Successfully.	none	2022-06-15 06:14:00.628754	t
270	Pavithran A	PavithranA.Pa@hcl.com	ServiceRequest	"request" Service Request Updated Successfully.	none	2022-06-15 06:14:12.799457	t
250	HCL ERS	hcl_ers@hcl.com	Organization	"HCL ERS R&D " Organization Updated Successfully.	none	2022-06-08 10:39:22.261482	f
249	HCL ERS	hcl_ers@hcl.com	Projects	"Data Workspace" Project Created Successfully.	none	2022-06-08 10:32:45.00793	f
140	HCL ERS	hcl_ers@hcl.com	Service Request Details	"Data Genie " Service Request Comment Deleted Successfully.	none	2022-06-07 11:37:56.198578	f
248	HCL ERS	hcl_ers@hcl.com	Organization	"HCL ERS R&D " Organization Updated Successfully.	none	2022-06-08 15:51:52.267714	f
246	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"request" Service Request Updated Successfully.	none	2022-06-08 10:09:21.484	f
247	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"request" Service Request Updated Successfully.	none	2022-06-08 10:09:21.717982	f
243	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"request" Service Request Updated Successfully.	none	2022-06-08 10:09:20.731953	f
244	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"request" Service Request Updated Successfully.	none	2022-06-08 10:09:20.998104	f
238	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"request" Service Request Updated Successfully.	none	2022-06-08 10:09:19.342526	f
245	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"request" Service Request Updated Successfully.	none	2022-06-08 10:09:21.256161	f
242	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"request" Service Request Updated Successfully.	none	2022-06-08 10:09:20.487774	f
241	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"request" Service Request Updated Successfully.	none	2022-06-08 10:09:20.167916	f
240	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"request" Service Request Updated Successfully.	none	2022-06-08 10:09:19.889377	f
239	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"request" Service Request Updated Successfully.	none	2022-06-08 10:09:19.638288	f
237	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service_request" Service Request Deleted Successfully.	none	2022-06-08 10:09:03.932692	f
271	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"Cost & Usage" Service Request Created Successfully.	none	2022-06-16 05:49:23.907557	t
272	HCL ERS	hcl_ers@hcl.com	Service Request Details	"Need to verify each cost" Comment Created Successfully.	none	2022-06-16 05:50:45.460517	t
273	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"Demo" Service Request Updated Successfully.	none	2022-06-16 11:37:51.346959	t
274	HCL ERS	hcl_ers@hcl.com	Service Request Details	"Test Comment" Comment Created Successfully.	none	2022-06-16 11:38:22.278549	t
275	HCL ERS	hcl_ers@hcl.com	Projects	"Data Quality Check" Project Updated Successfully.	none	2022-06-16 11:53:35.533465	t
276	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"Remove unwanted commit" Service Request Created Successfully.	none	2022-06-22 04:14:44.649538	t
277	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"Remove unwanted commit1" Service Request Updated Successfully.	none	2022-06-22 04:16:58.461219	t
278	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"Remove unwanted commit" Service Request Updated Successfully.	none	2022-06-22 04:18:33.760566	t
279	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"Remove unwanted commit1" Service Request Updated Successfully.	none	2022-06-22 04:18:59.087802	t
280	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"Remove unwanted commit1" Service Request Updated Successfully.	none	2022-06-22 04:19:34.908665	t
281	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"Remove unwanted commit" Service Request Updated Successfully.	none	2022-06-22 04:19:44.939241	t
282	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"Remove unwanted images" Service Request Created Successfully.	none	2022-06-22 04:23:03.674784	t
283	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"Remove unwanted image" Service Request Updated Successfully.	none	2022-06-22 04:23:24.282206	t
284	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"Remove unwanted images" Service Request Updated Successfully.	none	2022-06-22 04:25:12.338811	t
285	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"Remove unwanted image" Service Request Updated Successfully.	none	2022-06-22 04:25:23.164123	t
286	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"Remove unwanted images" Service Request Updated Successfully.	none	2022-06-22 04:25:32.512111	t
287	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"Remove unwanted images" Service Request Deleted Successfully.	none	2022-06-22 04:26:37.719217	t
288	Pavithran A	PavithranA.Pa@hcl.com	Projects	"DataGenie Version 21" Project Updated Successfully.	none	2022-06-22 07:16:02.67284	t
289	Pavithran A	PavithranA.Pa@hcl.com	Projects	"DataGenie Version 2" Project Updated Successfully.	none	2022-06-22 07:16:21.537105	t
290	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"Cost" Service Request Created Successfully.	none	2022-06-22 10:41:39.295826	t
291	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"Cost" Service Request Deleted Successfully.	none	2022-06-22 10:41:54.540416	t
19	Pavithran A	PavithranA.Pa@hcl.com	Projects	"Hawkeye" Project Created Successfully.	none	2022-05-12 05:42:24.144087	f
292	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"Remove unwanted commit" Service Request Updated Successfully.	none	2022-06-22 13:04:20.634437	f
293	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"fhfhjfyu" Service Request Created Successfully.	none	2022-07-04 12:31:19.325738	t
294	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"fhfhjfyu" Service Request Deleted Successfully.	none	2022-07-04 12:32:03.970227	t
295	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"Service Datascope" Service Request Created Successfully.	none	2022-07-04 13:20:31.176453	t
296	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"dgd" Service Request Created Successfully.	none	2022-07-04 13:59:51.382583	t
297	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"dgd" Service Request Deleted Successfully.	none	2022-07-04 14:00:24.895352	t
299	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"sridddd" Service Request Deleted Successfully.	none	2022-07-04 15:44:41.114465	t
300	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"service2" Service Request Created Successfully.	none	2022-07-04 17:17:14.871683	t
301	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"dataservice2" Service Request Created Successfully.	none	2022-07-04 17:19:49.318142	t
302	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"hgfjy" Service Request Created Successfully.	none	2022-07-04 21:05:41.509004	t
303	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"umesh" Service Request Created Successfully.	none	2022-07-04 21:10:50.179066	t
304	HCL ERS	hcl_ers@hcl.com	Projects	"gtyd" Project Created Successfully.	none	2022-07-05 05:51:15.050825	t
305	HCL ERS	hcl_ers@hcl.com	Projects	"gtyd" Project Deleted Successfully.	none	2022-07-05 05:52:16.605184	t
306	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"CDPE" Service Request Created Successfully.	none	2022-07-05 13:13:50.774602	t
307	HCL ERS	hcl_ers@hcl.com	Service Request Details	"wdff" Comment Created Successfully.	none	2022-07-05 13:14:45.090795	t
308	HCL ERS	hcl_ers@hcl.com	Service Request Details	"wdff" Service Request Comment Deleted Successfully.	none	2022-07-05 13:14:58.285858	f
309	HCL ERS	hcl_ers@hcl.com	Organization	"HCL Technologies Limited" Organization Updated Successfully.	none	2022-07-05 13:27:01.921414	t
310	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"CDPE" Service Request Created Successfully.	none	2022-07-07 08:43:47.355521	t
311	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"CDPE" Service Request Deleted Successfully.	none	2022-07-07 08:44:04.502446	t
312	HCL ERS	hcl_ers@hcl.com	Projects	"Research" Project Created Successfully.	none	2022-07-13 11:23:57.761037	t
313	HCL ERS	hcl_ers@hcl.com	Projects	"15072022" Project Created Successfully.	none	2022-07-15 11:47:37.02927	t
314	HCL ERS	hcl_ers@hcl.com	Projects	"dknd,ned" Project Created Successfully.	none	2022-07-15 11:49:46.119154	t
315	HCL ERS	hcl_ers@hcl.com	Projects	"dknd,ned" Project Deleted Successfully.	none	2022-07-15 11:49:57.643201	t
316	HCL ERS	hcl_ers@hcl.com	Projects	"cdp" Project Created Successfully.	none	2022-07-15 06:37:07.924453	f
317	HCL ERS	hcl_ers@hcl.com	Users	project xyz don’t have a team lead, please assign one	none	2022-07-26 15:31:37.837175	t
318	HCL ERS	hcl_ers@hcl.com	Users	project xyz don’t have a team lead, please assign one	none	2022-07-26 15:37:39.43961	t
319	HCL ERS	hcl_ers@hcl.com	Users	project xyz don’t have a team lead, please assign one	none	2022-07-26 15:41:33.879742	t
320	HCL ERS	hcl_ers@hcl.com	Users	project xyz don’t have a team lead, please assign one	none	2022-07-26 15:42:16.765646	t
321	HCL ERS	hcl_ers@hcl.com	Users	project xyz don’t have a team lead, please assign one	none	2022-07-26 15:44:24.719637	t
322	HCL ERS	hcl_ers@hcl.com	Users	project xyz don’t have a team lead, please assign one	none	2022-07-26 15:44:32.830773	t
323	HCL ERS	hcl_ers@hcl.com	Users	project xyz don’t have a team lead, please assign one	none	2022-07-26 15:45:01.219969	f
298	HCL ERS	hcl_ers@hcl.com	ServiceRequest	"sridddd" Service Request Created Successfully.	none	2022-07-04 15:42:25.484666	f
324	DE	hcl_ers@hcl.com	Projects	"cdp" Project Deleted Successfully.	none	2022-07-28 12:03:05.567719	f
325	DE	hcl_ers@hcl.com	Projects	"15072022" Project Deleted Successfully.	none	2022-07-28 13:06:51.891263	t
326	HCL ERS	hcl_ers@hcl.com	Projects	"Research" Project Deleted Successfully.	none	2022-07-29 06:56:41.561021	t
327	DE	hcl_ers@hcl.com	Projects	"51934391" Project Created Successfully.	none	2022-07-29 18:32:23.517825	t
328	DE	hcl_ers@hcl.com	Projects	"" Project Created Successfully.	none	2022-07-29 19:08:11.780748	t
329	DE	hcl_ers@hcl.com	Projects	"" Project Created Successfully.	none	2022-07-29 19:22:47.316367	t
330	DE	hcl_ers@hcl.com	Projects	"sachin" User Created Successfully.	none	2022-07-29 19:33:25.607443	t
331	DE	hcl_ers@hcl.com	Projects	"sachin" User Created Successfully.	none	2022-07-29 19:55:22.553303	t
332	DE	hcl_ers@hcl.com	Projects	"sacadsfgb" User Created Successfully.	none	2022-07-29 19:57:41.413504	t
333	DE	hcl_ers@hcl.com	Projects	"were" User Created Successfully.	none	2022-08-01 13:28:45.392455	t
334	DE	hcl_ers@hcl.com	Projects	"undefined" Project Deleted Successfully.	none	2022-08-01 14:22:46.438314	t
335	DE	hcl_ers@hcl.com	Projects	"eretdrseasw" User Created Successfully.	none	2022-08-01 14:25:23.00642	t
336	DE	hcl_ers@hcl.com	Projects	"undefined" Project Deleted Successfully.	none	2022-08-01 14:26:39.670543	t
337	DE	hcl_ers@hcl.com	Projects	"wewrtfrsdea" User Created Successfully.	none	2022-08-01 14:30:13.246059	t
338	DE	hcl_ers@hcl.com	Projects	"wewrtfrsdea" User Profile Deleted Successfully.	none	2022-08-01 14:30:24.923752	t
339	HCL ERS	hcl_ers@hcl.com	Projects	"CDP" Project Created Successfully.	none	2022-08-01 15:47:02.89738	t
340	DE	hcl_ers@hcl.com	Projects	"wertyrewWERE" User Created Successfully.	none	2022-08-01 16:31:16.319011	t
341	DE	hcl_ers@hcl.com	Projects	"wertyrewWERE" User Profile Deleted Successfully.	none	2022-08-01 16:31:48.896625	t
342	HCL ERS	hcl_ers@hcl.com	Users	project xyz don’t have a team lead, please assign one	none	2022-08-01 12:12:41.760292	t
343	HCL ERS	hcl_ers@hcl.com	Projects	"DE_AdminProject" Project Created Successfully.	none	2022-08-01 12:20:54.781774	t
344	DE	hcl_ers@hcl.com	Projects	"wdertytutyjdthrsg" User Created Successfully.	none	2022-08-01 18:12:55.697707	t
345	DE	hcl_ers@hcl.com	Projects	"wdertytutyjdthrsg" User Profile Deleted Successfully.	none	2022-08-01 18:13:08.63973	t
346	DE	hcl_ers@hcl.com	Projects	"sefedwer" User Created Successfully.	none	2022-08-01 19:45:59.713443	t
347	DE	hcl_ers@hcl.com	Projects	"sefedwer" User Profile Deleted Successfully.	none	2022-08-01 19:46:20.816579	t
348	DE	hcl_ers@hcl.com	Projects	"sdftgyfhtrgfa" User Created Successfully.	none	2022-08-01 19:48:05.246966	t
349	DE	hcl_ers@hcl.com	Projects	"sdftgyfhtrgfa" User Profile Deleted Successfully.	none	2022-08-01 19:48:15.638955	t
350	DE	hcl_ers@hcl.com	Projects	"dgfgyjhtrsgfe" User Created Successfully.	none	2022-08-01 19:49:11.019279	t
351	DE	hcl_ers@hcl.com	Projects	"dgfgyjhtrsgfe" User Profile Deleted Successfully.	none	2022-08-01 19:49:21.46076	t
352	DE	hcl_ers@hcl.com	Projects	"sfgdrthyjhtg" User Created Successfully.	none	2022-08-01 19:49:56.836621	t
353	DE	hcl_ers@hcl.com	Projects	"sfgdrthyjhtg" User Profile Deleted Successfully.	none	2022-08-01 19:50:07.119702	t
354	DE	hcl_ers@hcl.com	Projects	"Asdfghmngbfsvd" User Created Successfully.	none	2022-08-01 19:51:35.290194	t
355	DE	hcl_ers@hcl.com	Projects	"Asdfghmngbfsvd" .	none	2022-08-01 19:52:02.891235	t
356	DE	hcl_ers@hcl.com	Projects	"ewrtyhtrgefwdDWAFSERDG" User Created Successfully.	none	2022-08-01 20:47:47.525315	t
357	DE	hcl_ers@hcl.com	Projects	"Sachin" User Created Successfully.	none	2022-08-01 20:52:47.506776	t
358	DE	hcl_ers@hcl.com	Projects	"Sachin" User Profile Deleted Successfully.	none	2022-08-01 20:53:31.534832	t
359	HCL ERS	hcl_ers@hcl.com	Projects	"Graviton_CDP_project" Project Created Successfully.	none	2022-08-02 04:38:20.982007	t
360	HCL ERS	hcl_ers@hcl.com	Projects	"hufcikndfjioerf" Project Created Successfully.	none	2022-08-02 07:00:11.914346	t
361	HCL ERS	hcl_ers@hcl.com	Projects	"likjyuyhfdfszx" Project Created Successfully.	none	2022-08-02 07:00:28.033534	t
362	HCL ERS	hcl_ers@hcl.com	Projects	"kjinmsdijfs" Project Created Successfully.	none	2022-08-02 07:00:42.043642	t
363	HCL ERS	hcl_ers@hcl.com	Projects	"Kubernetes_cluster" Project Created Successfully.	none	2022-08-02 07:10:50.29457	t
364	HCL ERS	hcl_ers@hcl.com	Projects	"Airflow_Project" Project Created Successfully.	none	2022-08-02 07:11:13.334671	t
365	HCL ERS	hcl_ers@hcl.com	Projects	"Graviton_Kubernetes" Project Created Successfully.	none	2022-08-02 07:11:51.191866	t
366	HCL ERS	hcl_ers@hcl.com	Projects	"Resource Project" Project Created Successfully.	none	2022-08-02 07:59:43.852873	t
367	DE	hcl_ers@hcl.com	Projects	"rtytreawsedrfgh" User Created Successfully.	none	2022-08-02 15:16:44.295789	t
368	DE	hcl_ers@hcl.com	Projects	"rtytreawsedrfgh" User Profile Deleted Successfully.	none	2022-08-02 15:17:28.841231	t
369	DE	hcl_ers@hcl.com	Projects	"Dineshh" User Created Successfully.	none	2022-08-02 15:18:24.775748	t
370	DE	hcl_ers@hcl.com	Projects	"Dineshh" User Profile Deleted Successfully.	none	2022-08-02 15:20:54.281694	t
371	DE	hcl_ers@hcl.com	Projects	"ertytredfg" User Created Successfully.	none	2022-08-02 15:30:58.120535	t
372	DE	hcl_ers@hcl.com	Projects	"werftrewsdfdewedf" User Created Successfully.	none	2022-08-02 15:33:37.623147	t
373	DE	hcl_ers@hcl.com	Projects	"werftrewsdfdewedf" User Profile Deleted Successfully.	none	2022-08-02 15:43:21.255362	t
374	HCL ERS	hcl_ers@hcl.com	Projects	"Project Managment" Project Created Successfully.	none	2022-08-02 10:13:24.712188	t
375	DE	hcl_ers@hcl.com	Projects	"ertyuytdrsedfcg" User Created Successfully.	none	2022-08-02 15:50:37.863612	t
376	DE	hcl_ers@hcl.com	Projects	"ertyuytdrsedfcg" User Profile Deleted Successfully.	none	2022-08-02 15:54:50.790255	t
377	DE	hcl_ers@hcl.com	Projects	"Dinesh" User Created Successfully.	none	2022-08-02 15:55:22.276497	t
378	DE	hcl_ers@hcl.com	Projects	"Dineshdfghgtfrdfg" User Created Successfully.	none	2022-08-02 15:57:53.729643	t
379	DE	hcl_ers@hcl.com	Projects	"Dineshdfghgtfrdfg" User Profile Deleted Successfully.	none	2022-08-02 15:58:10.052574	t
380	HCL ERS	hcl_ers@hcl.com	Projects	"test" Project Created Successfully.	none	2022-08-02 11:59:40.330314	t
381	HCL ERS	hcl_ers@hcl.com	Projects	"{Standard_D5_v2}" Project Deleted Successfully.	none	2022-08-03 07:25:11.248833	t
382	HCL ERS	hcl_ers@hcl.com	Projects	"{Standard_D2_v2}" Project Deleted Successfully.	none	2022-08-03 07:25:32.833064	t
383	HCL ERS	hcl_ers@hcl.com	Projects	"{Standard_D2_v2,Standard_D3_v2}" Project Deleted Successfully.	none	2022-08-03 07:36:55.32046	t
384	HCL ERS	hcl_ers@hcl.com	Projects	"{Standard_D2_v2}" Project Deleted Successfully.	none	2022-08-03 07:50:34.876116	t
385	DE	hcl_ers@hcl.com	Users	"erthrgefwdaesrgd" User Profile Deleted Successfully.	none	2022-08-03 13:56:27.392477	t
386	DE	hcl_ers@hcl.com	Users	"eeeerrtrew" User Profile Deleted Successfully.	none	2022-08-03 15:03:13.081443	t
387	DE	hcl_ers@hcl.com	Users	"rgfewretrr" User Profile Deleted Successfully.	none	2022-08-03 15:04:29.702618	t
388	HCL ERS	hcl_ers@hcl.com	Projects	"undefined" Project Deleted Successfully.	none	2022-08-03 10:51:35.07494	t
389	DE	hcl_ers@hcl.com	Users	"deepu" User Profile Deleted Successfully.	none	2022-08-03 10:55:18.875197	t
390	HCL ERS	hcl_ers@hcl.com	Projects	"hello" Project Created Successfully.	none	2022-08-03 11:50:48.234571	t
\.


--
-- Data for Name: Organization; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public."Organization" (id, name, details, created_on, created_by, updated_on, updated_by) FROM stdin;
1	HCL ERS R&D 	Research Center for Data Engg & Analytics..	2022-06-06 09:58:12.583816	hcl_ers@hcl.com	2022-06-08 10:39:20.310168	hcl_ers@hcl.com
2	HCL Technologies Limited	Demo organization for data workspace...	2022-06-08 10:39:46.027625	hcl_ers@hcl.com	2022-07-05 13:26:58.515897	hcl_ers@hcl.com
\.


--
-- Data for Name: ProjectManagment; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public."ProjectManagment" (projid, projectname, status, leadid, created_on, created_by, updated_on, updated_by) FROM stdin;
1	Graviton_ERS	t	2	2022-08-01 12:07:47.102597	hcl_ers@hcl.com	\N	\N
2	Graviton DataScope	t	3	2022-08-01 12:08:30.404645	hcl_ers@hcl.com	\N	\N
4	ERS_HCL	t	5	2022-08-01 12:09:03.661702	hcl_ers@hcl.com	\N	\N
5	DE_admin	t	1	2022-08-01 12:18:31.494893	hcl_ers@hcl.com	\N	\N
6	DE_AdminProject	t	2	2022-08-01 12:20:50.968359	hcl_ers@hcl.com	\N	\N
11	Kubernetes_cluster	t	3	2022-08-02 07:10:46.367452	hcl_ers@hcl.com	\N	\N
13	Graviton_Kubernetes	t	5	2022-08-02 07:11:47.33139	hcl_ers@hcl.com	\N	\N
14	Resource Project	t	4	2022-08-02 07:59:40.073166	hcl_ers@hcl.com	\N	\N
16	hello	t	5	2022-08-03 11:50:44.42221	hcl_ers@hcl.com	\N	\N
\.


--
-- Data for Name: ProjectResource; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public."ProjectResource" (id, projid, aksclusterallocatedcount, aksnodesmaxlimit, aks_cluster_provisioned_count, aksnodesallowedvmtype, aksallowedregions) FROM stdin;
13	15	2	4	0	{Standard_D1_v21}	South Central US
14	14	3	4	0	{Standard_D4_v2}	Southeast Asia
\.


--
-- Data for Name: Projects; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public."Projects" (projid, projectname, details, resourcegroup, status, orgid, created_on, created_by, updated_on, updated_by, teamlead) FROM stdin;
4	Anomaly Detection	Component of Graviton DW	de-cdp-test	t	1	2022-06-08 09:58:20.066459	hcl_ers@hcl.com	\N	\N	\N
5	Data Workspace	Demo Purpose	de-test-cdp	t	1	2022-06-08 10:32:44.298029	hcl_ers@hcl.com	\N	\N	\N
6	ERS Research - Project 1	Demo project	de-cdp	t	2	2022-06-08 10:41:04.78987	hcl_ers@hcl.com	\N	\N	\N
3	Data Quality Check	Quality Check for Data2	de-test	t	1	2022-06-07 08:19:23.768875	PavithranA.Pa@hcl.com	2022-06-16 11:53:33.543148	hcl_ers@hcl.com	\N
7	DataGenie Version 2	Component of Graviton	de-test-cdp	t	2	2022-06-09 08:06:31.154161	PavithranA.Pa@hcl.com	2022-06-22 07:16:18.247996	PavithranA.Pa@hcl.com	\N
1	Graviton Project	Testing Purpose	de-cdp-rg	t	1	2022-06-06 10:21:43.549964	PavithranA.Pa@hcl.com	\N	\N	dpadmin
2	Graviton DataGenie	Component 	test-group	f	1	2022-06-06 10:37:07.322518	PavithranA.Pa@hcl.com	2022-06-08 10:42:15.310388	HCL ERS	\N
14	CDP	CDP1	DGGA	t	1	2022-08-01 15:46:59.112653	hcl_ers@hcl.com	\N	\N	\N
15	test	fsdfs	sdasdsa	t	2	2022-08-02 11:59:36.520642	hcl_ers@hcl.com	\N	\N	\N
\.


--
-- Data for Name: ProjectsConfig; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public."ProjectsConfig" (id, projectname, acc_mail, selected_on, selected_by) FROM stdin;
1	Anomaly Detection	PavithranA.Pa@hcl.com	2022-06-09 07:56:45.103065	PavithranA.Pa@hcl.com
3	Data Workspace	de@hclazurecloudconnect.onmicrosoft.com	2022-06-23 11:38:46.184666	de@hclazurecloudconnect.onmicrosoft.com
2	Graviton Project	hcl_ers@hcl.com	2022-08-02 10:54:47.538395	hcl_ers@hcl.com
\.


--
-- Data for Name: ReportDetails; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public."ReportDetails" (report_type, report_title, report_url, report_thumbnail, report_provider, id, status) FROM stdin;
Dashboards	Predictive Maintenance - Batch	https://app.powerbi.com/groups/me/reports/f01ef338-aa3a-4292-98aa-7d550ca6e227/ReportSection	predictive_batch.png	PowerBI	1	f
Dashboards	Predictive Maintenance - Real Time	https://app.powerbi.com/groups/me/reports/d8eb55ef-ef28-4a4f-9058-c4443721afec/ReportSection	predictive_real.png	PowerBI	2	f
Dashboards	Observability Monitoring	https://prathamgrafanadash-bwc3dqf4d3fucjhr.eus.grafana.azure.com/d/9wTL7uunk/custom-dashboard?orgId=1	observability.png	Grafana	3	t
Dashboards	Airflow Cluster Monitoring	https://prathamgrafanadash-bwc3dqf4d3fucjhr.eus.grafana.azure.com/d/lFXqBGxWk/airflow-cluster-monitoring?orgId=1&refresh=5s	airflow_cluster.png	Grafana	4	t
Reports	Cosmos DB Insights	https://prathamgrafanadash-bwc3dqf4d3fucjhr.eus.grafana.azure.com/d/auqIWz77kmtr/cosmos-db-insights?orgId=1	cosmosdb.png	Grafana	5	t
Reports	Azure Resources Overview	https://prathamgrafanadash-bwc3dqf4d3fucjhr.eus.grafana.azure.com/d/Mtwt2BV7kres/azure-resources-overview?orgId=1	azureresources.png	Grafana	7	t
Reports	Data Pipeline Monitoring	https://prathamgrafanadash-bwc3dqf4d3fucjhr.eus.grafana.azure.com/d/nedI6pu7z/adf-data-pipelines-view-1?orgId=1	datapipeline.png	Grafana	8	t
\.


--
-- Data for Name: Report_Details; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public."Report_Details" (report_type, report_title, report_url, report_thumbnail, report_provider, id, status) FROM stdin;
Reports	Data Pipeline Monitoring	https://prathamgrafanadash-bwc3dqf4d3fucjhr.eus.grafana.azure.com/d/nedI6pu7z/adf-data-pipelines-view-1?orgId=1	datapipeline.png	Grafana	1	t
Reports	Observability Monitoring	https://prathamgrafanadash-bwc3dqf4d3fucjhr.eus.grafana.azure.com/d/9wTL7uunk/custom-dashboard?orgId=1	observability.png	Grafana	2	t
Frameworks	Airflow Cluster Monitoring	https://prathamgrafanadash-bwc3dqf4d3fucjhr.eus.grafana.azure.com/d/lFXqBGxWk/airflow-cluster-monitoring?orgId=1&refresh=5s	airflow_cluster.png	Grafana	3	t
Frameworks	Cosmos DB Insights	https://prathamgrafanadash-bwc3dqf4d3fucjhr.eus.grafana.azure.com/d/auqIWz77kmtr/cosmos-db-insights?orgId=1	cosmosdb.png	Grafana	4	t
Dashboards	Azure Resources Overview	https://prathamgrafanadash-bwc3dqf4d3fucjhr.eus.grafana.azure.com/d/Mtwt2BV7kres/azure-resources-overview?orgId=1	azureresources.png	Grafana	6	t
\.


--
-- Data for Name: Resource; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public."Resource" (id, kubernate_cluster, node_per_cluster, vm_size, aks_cluster, created_on, created_by, updated_on, updated_by) FROM stdin;
\.


--
-- Data for Name: Role; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public."Role" (role_id, role_name, role_desc) FROM stdin;
2	DP Admin	Collecting, Analyzing and Interpreting extremely large amounts of data.
3	Data Engineer - Team Lead	Building data pipelines to bring together information from different source systems.
1	Platform Support Engineer	Customer who uses the Services and/or Equipment in the course of any trade or business.
4	Data Engineer - Team Member	Building data pipelines to bring together information from different source systems.
\.


--
-- Data for Name: ServiceRequest; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public."ServiceRequest" (id, sr_id, title, description, uploaded_files, sr_status, created_on, created_by, updated_on, updated_by) FROM stdin;
43	SR000043	Remove unwanted commit	Need to remove the unwanted code from SVN 		New	2022-06-22 04:14:42.640211	hcl_ers@hcl.com	2022-06-22 13:04:18.67183	hcl_ers@hcl.com
47	SR000044	Service Datascope	Request for service Datascope	temp_files/service_req_files/result_SR000044.csv	New	2022-07-04 13:20:29.190725	hcl_ers@hcl.com	\N	\N
3	SR000003	Service Request Number	Line 1\r\nLine 2\r\nLine3	temp_files/service_req_files/Customer_OrderData_SR000003.csv	New	2022-05-31 07:18:36.555682	Pavithran A	2022-06-01 05:13:22.907903	Pavithran A
4	SR000004	service	custom	temp_files/service_req_files/train_label_SR000004.csv	New	2022-06-01 11:38:58.656101	Pavithran A	\N	\N
50	SR000048	service2	servicedoc	temp_files/service_req_files/raw_customers_SR000048.xlsx	New	2022-07-04 17:17:12.890987	hcl_ers@hcl.com	\N	\N
51	SR000051	dataservice2	data2	temp_files/service_req_files/raw_payments_SR000051.csv	New	2022-07-04 17:19:47.365533	hcl_ers@hcl.com	\N	\N
52	SR000052	hgfjy	kliuythtduy		New	2022-07-04 21:05:39.556581	hcl_ers@hcl.com	\N	\N
53	SR000053	umesh	umesh request		New	2022-07-04 21:10:48.277546	hcl_ers@hcl.com	\N	\N
29	SR000027	HCL SEZ Bangalore	Data engineering	temp_files/service_req_files/telemetry_80_SR000026 (3)_SR000027.csv	New	2022-06-07 12:30:57.796494	Pavithran A	2022-06-08 15:55:09.267118	HCL ERS
10	SR000010	DataWork space	Graviton	temp_files/service_req_files/customer details_SR000010.xlsx	New	2022-06-01 16:57:30.449108	Pavithran A	\N	\N
54	SR000054	CDPE	wafsedggh		In Progress	2022-07-05 13:13:48.390896	hcl_ers@hcl.com	\N	\N
18	SR000011	SR request	request details	temp_files/service_req_files/train image_SR000011.png	New	2022-06-06 10:53:00.289698	Pavithran A	\N	\N
20	SR000019	SDCS	ASDJ	temp_files/service_req_files/1_SR000019.png	New	2022-06-06 11:17:07.747982	Pavithran A	\N	\N
41	SR000041	Windows VM 	Windows VM for Component Deployment	temp_files/service_req_files/dbassist8_SR000041.PNG	Completed	2022-06-08 10:02:13.984806	hcl_ers@hcl.com	\N	\N
42	SR000042	Cost & Usage	Verify the  Cost details	temp_files/service_req_files/result_SR000042.csv	In Progress	2022-06-16 05:49:23.311466	hcl_ers@hcl.com	\N	\N
24	SR000024	service	request		Completed	2022-06-06 13:12:58.235204	Pavithran A	\N	\N
26	SR000026	Graviton	ServiceRequest	temp_files/service_req_files/telemetry_80_SR000026.csv	New	2022-06-06 19:25:16.43293	Pavithran A	\N	\N
25	SR000025	Demo	service demo  purpose		In Progress	2022-06-06 13:13:29.745594	Pavithran A	2022-06-16 11:37:49.291085	hcl_ers@hcl.com
\.


--
-- Data for Name: Settings; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public."Settings" (id, title, storage_account, azure_sql_instance, service_principal, airflow_url, prefect_url, notebook, aion_url, databricks, powerbi, druid, kibana, tenant_id, created_on, created_by, updated_on, updated_by) FROM stdin;
\.


--
-- Data for Name: UserRole; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public."UserRole" (id, user_id, role_id) FROM stdin;
1	1	1
3	3	2
2	2	3
4	4	4
5	5	4
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public."Users" (user_id, user_name, user_mail, user_profile, password, emp_id, role_id) FROM stdin;
4	Himanshu	himanshudu@hcl.com		43ef3353bfe2967f3ac2e13df6165a65	\N	\N
5	Dinesh	dineshbr@hcl.com		bda70b76a2f1f691318e79ed17e4d20d	\N	3
3	DE	de@hclazurecloudconnect.onmicrosoft.com		07b0f6d725978648440026c450abbced	\N	2
1	HCL ERS	hcl_ers@hcl.com		0444835de0d17964c613790917197471	\N	1
2	Pavithran A	pavithrana.pa@hcl.com		816477965bef89708c8636855a5ef011	\N	4
\.


--
-- Data for Name: recentlyviewed; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.recentlyviewed (id, assettype, name, url, created_on) FROM stdin;
1	Azure Data Lake Storage Gen2	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=b0d6c644-5b37-4572-9b75-776c8fe5deb3&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-05-06 12:05:32.063574
2	Azure Data Lake Storage Gen2	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=b0d6c644-5b37-4572-9b75-776c8fe5deb3&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-05-06 12:19:23.239492
3	Azure Data Lake Storage Gen2	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=b0d6c644-5b37-4572-9b75-776c8fe5deb3&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-05-06 12:20:43.284125
4	Azure Data Lake Storage Gen2	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=b0d6c644-5b37-4572-9b75-776c8fe5deb3&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-05-09 07:49:00.434881
5	Azure SQL Database	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=11e327e5-062a-4583-84d1-def6f6f60000&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-05-09 07:50:33.289453
6	Azure Data Factory	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=9385034c-3cc3-4a9a-b4bb-c991e0944864&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-05-09 16:46:51.489269
7	Azure Data Factory	Graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=24094db0-4b71-4544-b1b4-3623fb8d0729&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-05-09 18:25:30.089703
8	Azure Data Factory	Graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=24094db0-4b71-4544-b1b4-3623fb8d0729&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-05-10 08:51:59.262343
9	Azure Data Factory	Graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=24094db0-4b71-4544-b1b4-3623fb8d0729&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-05-10 10:00:37.94499
10	Azure Synapse Analytics	Graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=d95d151d-774d-4ad7-a8b1-73f6f6f60000&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-05-10 10:43:59.616764
11	Azure Data Lake Storage Gen2	Graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=e2bcf948-3628-4463-8aa6-d81fba957d1d&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-05-10 12:06:04.160509
12	Azure Data Factory	Graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=24094db0-4b71-4544-b1b4-3623fb8d0729&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-05-10 14:11:23.58229
13	Azure Blob Storage	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=2258d8f6-fee6-4f5a-9ef6-2930070a061c&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-05-10 08:59:00.675943
14	Azure Data Lake Storage Gen2	Graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=b0d6c644-5b37-4572-9b75-776c8fe5deb3&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-05-10 14:38:41.1237
15	Azure SQL Database	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=70d74584-c270-47b3-a450-6df6f6f60000&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-05-10 09:13:51.563083
16	Azure Data Lake Storage Gen2	Graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=28ddd3ce-af3b-4499-b803-8449f993fdaf&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-05-10 14:49:05.268796
17	Azure SQL Database	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=70d74584-c270-47b3-a450-6df6f6f60000&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-05-10 09:53:51.828604
18	Azure Data Lake Storage Gen2	\N	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=9705bd47-b677-4cfb-a300-7c7ae83ee61c&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-05-11 12:48:17.557386
19	Azure Data Lake Storage Gen2	\N	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=b0d6c644-5b37-4572-9b75-776c8fe5deb3&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-05-13 07:59:50.637265
20	Azure Data Factory	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=24094db0-4b71-4544-b1b4-3623fb8d0729&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-05-17 05:28:40.582586
21	Azure Synapse Analytics	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=7dce1166-e0a5-4d5e-a0a8-fbf6f6f60000&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-05-18 11:16:09.710701
22	Azure Synapse Analytics	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=7dce1166-e0a5-4d5e-a0a8-fbf6f6f60000&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-05-18 12:48:13.80793
23	Azure Data Factory	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=2c50aee5-d8ee-470c-82b7-5015110b3e42&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-05-18 17:01:10.52594
24	Azure SQL Database	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=70d74584-c270-47b3-a450-6df6f6f60000&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-05-20 07:51:04.681018
25	Azure Synapse Analytics	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=7dce1166-e0a5-4d5e-a0a8-fbf6f6f60000&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-05-20 08:07:31.88845
26	Azure SQL Database	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=57fcbd9a-439b-4224-b035-17f6f6f60000&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-05-20 09:06:13.7019
27	Azure Data Factory	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=24094db0-4b71-4544-b1b4-3623fb8d0729&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-05-20 12:43:52.397347
28	Azure Data Factory	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=9385034c-3cc3-4a9a-b4bb-c991e0944864&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-06-01 14:17:28.495617
29	Azure Data Factory	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=9385034c-3cc3-4a9a-b4bb-c991e0944864&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-06-07 13:14:05.708081
30	Azure Data Lake Storage Gen2	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=e2bcf948-3628-4463-8aa6-d81fba957d1d&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-06-07 08:12:13.58314
31	Azure Data Factory	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=a6ffd9a7-c69a-4d7a-b3db-257856517909&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-06-08 10:45:53.92238
32	Azure Data Lake Storage Gen2	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=61a65a1f-2e63-4273-b0cb-a51119f88927&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-06-08 10:58:10.257191
33	Azure Synapse Analytics	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=d95d151d-774d-4ad7-a8b1-73f6f6f60000&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-06-10 14:59:26.85029
34	Azure Data Lake Storage Gen2	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=e4a115a1-9cfd-4964-b021-0a21ba0e5822&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-06-10 12:22:26.378358
35	Azure Data Lake Storage Gen2	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=21681cf0-8c81-4d71-a658-53992fea36e9&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-06-10 12:23:15.187598
36	Azure Data Lake Storage Gen2	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=74a07a69-8a9a-4aa7-a1ac-3cad76632573&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-06-10 21:12:14.503553
37	Azure Data Lake Storage Gen2	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=74a07a69-8a9a-4aa7-a1ac-3cad76632573&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-06-11 13:28:46.92257
38	merged_parquet.parquet	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=e4a115a1-9cfd-4964-b021-0a21ba0e5822&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-06-11 14:54:27.754191
39	Device Telemetry Data	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=21681cf0-8c81-4d71-a658-53992fea36e9&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-06-13 17:25:24.0389
40	aion_prediction_result	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=d95d151d-774d-4ad7-a8b1-73f6f6f60000&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-06-13 19:19:39.442081
41	AION_Prediction.csv	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=74a07a69-8a9a-4aa7-a1ac-3cad76632573&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-06-13 19:42:57.743673
42	AION_Prediction.csv	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=74a07a69-8a9a-4aa7-a1ac-3cad76632573&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-06-13 19:43:06.344462
43	AzureML_Prediction.csv	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=b0d6c644-5b37-4572-9b75-776c8fe5deb3&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-06-14 12:46:47.411478
44	Device Telemetry Data	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=21681cf0-8c81-4d71-a658-53992fea36e9&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-06-14 15:42:45.037718
45	Azure Data Lake Storage Gen2	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=b0d6c644-5b37-4572-9b75-776c8fe5deb3&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-06-15 10:06:40.829216
46	tblCustomer_Product_InstallBase	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=780c2dc6-aa72-432b-a4ad-9df6f6f60000&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-06-15 13:58:16.346882
47	tblDeviceInfo	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=f839cbff-0efe-4d78-abd4-5ef6f6f60000&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-06-15 13:58:29.612891
48	merged_parquet.parquet	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=e4a115a1-9cfd-4964-b021-0a21ba0e5822&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-06-16 10:59:50.717758
49	merged_parquet.parquet	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=e4a115a1-9cfd-4964-b021-0a21ba0e5822&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-06-16 12:59:21.083478
50	merged_parquet.parquet	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=e4a115a1-9cfd-4964-b021-0a21ba0e5822&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-06-17 14:35:22.784545
51	Device Telemetry Data	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=21681cf0-8c81-4d71-a658-53992fea36e9&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-06-20 06:51:25.834599
52	data	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=05022471-a57e-4bf4-b4df-b62730e2263b&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-06-24 11:29:52.869058
53	AION_Prediction.csv	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=74a07a69-8a9a-4aa7-a1ac-3cad76632573&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-06-29 14:45:37.442887
54	AION_Prediction.csv	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=74a07a69-8a9a-4aa7-a1ac-3cad76632573&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-07-01 15:17:56.461061
55	AION_Prediction.csv	graviton	https://web.purview.azure.com/resource/prathamcdppurview/main/catalog/entity?guid=74a07a69-8a9a-4aa7-a1ac-3cad76632573&section=details&feature.tenant=189de737-c93a-4f5a-8b68-6f4ca9941912	2022-07-01 15:18:49.290322
\.


--
-- Name: Comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public."Comment_id_seq"', 27, true);


--
-- Name: DataSource_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public."DataSource_id_seq"', 1, false);


--
-- Name: KubernetesCluster_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public."KubernetesCluster_id_seq"', 32, true);


--
-- Name: Notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public."Notifications_id_seq"', 390, true);


--
-- Name: Organization_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public."Organization_id_seq"', 2, true);


--
-- Name: ProjectManagment_projid_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public."ProjectManagment_projid_seq"', 16, true);


--
-- Name: ProjectResource_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public."ProjectResource_id_seq"', 14, true);


--
-- Name: ProjectsConfig_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public."ProjectsConfig_id_seq"', 3, true);


--
-- Name: Projects_projid_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public."Projects_projid_seq"', 15, true);


--
-- Name: Resource_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public."Resource_id_seq"', 1, false);


--
-- Name: Role_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public."Role_role_id_seq"', 1, false);


--
-- Name: ServiceRequest_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public."ServiceRequest_id_seq"', 55, true);


--
-- Name: Settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public."Settings_id_seq"', 1, false);


--
-- Name: UserRole_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public."UserRole_id_seq"', 1, false);


--
-- Name: Users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public."Users_user_id_seq"', 39, true);


--
-- Name: recentlyviewed_id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public.recentlyviewed_id_seq', 55, true);


--
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- Name: DataSource DataSource_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."DataSource"
    ADD CONSTRAINT "DataSource_pkey" PRIMARY KEY (id);


--
-- Name: KubernetesCluster KubernetesCluster_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."KubernetesCluster"
    ADD CONSTRAINT "KubernetesCluster_pkey" PRIMARY KEY (id);


--
-- Name: KubernetesCluster KubernetesCluster_project_name_key; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."KubernetesCluster"
    ADD CONSTRAINT "KubernetesCluster_project_name_key" UNIQUE (project_name);


--
-- Name: KubernetesCluster KubernetesCluster_resource_name_key; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."KubernetesCluster"
    ADD CONSTRAINT "KubernetesCluster_resource_name_key" UNIQUE (resource_name);


--
-- Name: Notifications Notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."Notifications"
    ADD CONSTRAINT "Notifications_pkey" PRIMARY KEY (id);


--
-- Name: Organization Organization_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."Organization"
    ADD CONSTRAINT "Organization_pkey" PRIMARY KEY (id);


--
-- Name: ProjectManagment ProjectManagment_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."ProjectManagment"
    ADD CONSTRAINT "ProjectManagment_pkey" PRIMARY KEY (projid);


--
-- Name: ProjectManagment ProjectManagment_projectname_key; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."ProjectManagment"
    ADD CONSTRAINT "ProjectManagment_projectname_key" UNIQUE (projectname);


--
-- Name: ProjectResource ProjectResource_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."ProjectResource"
    ADD CONSTRAINT "ProjectResource_pkey" PRIMARY KEY (id);


--
-- Name: ProjectsConfig ProjectsConfig_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."ProjectsConfig"
    ADD CONSTRAINT "ProjectsConfig_pkey" PRIMARY KEY (id);


--
-- Name: Projects Projects_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."Projects"
    ADD CONSTRAINT "Projects_pkey" PRIMARY KEY (projid);


--
-- Name: Projects Projects_projectname_key; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."Projects"
    ADD CONSTRAINT "Projects_projectname_key" UNIQUE (projectname);


--
-- Name: ReportDetails ReportDetails_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."ReportDetails"
    ADD CONSTRAINT "ReportDetails_pkey" PRIMARY KEY (id);


--
-- Name: Report_Details Report_Details_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."Report_Details"
    ADD CONSTRAINT "Report_Details_pkey" PRIMARY KEY (id);


--
-- Name: Resource Resource_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."Resource"
    ADD CONSTRAINT "Resource_pkey" PRIMARY KEY (id);


--
-- Name: Role Role_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY (role_id);


--
-- Name: Role Role_role_name_key; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_role_name_key" UNIQUE (role_name);


--
-- Name: ServiceRequest ServiceRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."ServiceRequest"
    ADD CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY (id);


--
-- Name: Settings Settings_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."Settings"
    ADD CONSTRAINT "Settings_pkey" PRIMARY KEY (id);


--
-- Name: UserRole UserRole_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."UserRole"
    ADD CONSTRAINT "UserRole_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (user_id);


--
-- Name: Users Users_user_name_key; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_user_name_key" UNIQUE (user_name);


--
-- Name: recentlyviewed recentlyviewed_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.recentlyviewed
    ADD CONSTRAINT recentlyviewed_pkey PRIMARY KEY (id);


--
-- Name: Users Users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_role_id_fkey" FOREIGN KEY (role_id) REFERENCES public."Role"(role_id);


--
-- Name: ProjectResource fk_projects; Type: FK CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public."ProjectResource"
    ADD CONSTRAINT fk_projects FOREIGN KEY (projid) REFERENCES public."Projects"(projid);


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

