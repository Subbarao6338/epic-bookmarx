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
-- Name: logvalidationdtl; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.logvalidationdtl (
    "Id" integer NOT NULL,
    "CreatedDate" timestamp without time zone,
    "FilePath" character varying(100),
    "TaskName" character varying(50),
    "TagNames" character varying(500),
    "RegExValue" character varying(500),
    "Status" character varying(50),
    "TaskType" character varying(50),
    selected_task_name text,
    result_type text,
    log_delimiter text
);


ALTER TABLE public.logvalidationdtl OWNER TO decdpdev;

--
-- Name: logvalidationdtl_Id_seq; Type: SEQUENCE; Schema: public; Owner: decdpdev
--

CREATE SEQUENCE public."logvalidationdtl_Id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."logvalidationdtl_Id_seq" OWNER TO decdpdev;

--
-- Name: logvalidationdtl_Id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: decdpdev
--

ALTER SEQUENCE public."logvalidationdtl_Id_seq" OWNED BY public.logvalidationdtl."Id";


--
-- Name: regex_tasks; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.regex_tasks (
    task_name character varying(100),
    task_description text,
    results text,
    exec_log text,
    status character varying(100),
    log_file_name character varying(100),
    log_delimiter text,
    training_type character varying(100),
    "task_CreatedDate" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "task_CompletedOn" timestamp without time zone
);


ALTER TABLE public.regex_tasks OWNER TO decdpdev;

--
-- Name: tag_data; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.tag_data (
    tag_name character varying(100),
    task_name character varying(100),
    is_predefined character varying(100),
    predefined_tag_json_format json
);


ALTER TABLE public.tag_data OWNER TO decdpdev;

--
-- Name: tag_selection; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.tag_selection (
    task_name character varying(100),
    log_line_no character varying(100),
    tag_id character varying(100),
    tag_name character varying(100),
    selected_text text,
    text_start character varying(100),
    text_end character varying(100)
);


ALTER TABLE public.tag_selection OWNER TO decdpdev;

--
-- Name: uploaded_log_data; Type: TABLE; Schema: public; Owner: decdpdev
--

CREATE TABLE public.uploaded_log_data (
    log_line_no character varying(100),
    task_name character varying(100),
    log_data text,
    is_marked character varying(100)
);


ALTER TABLE public.uploaded_log_data OWNER TO decdpdev;

--
-- Name: logvalidationdtl Id; Type: DEFAULT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.logvalidationdtl ALTER COLUMN "Id" SET DEFAULT nextval('public."logvalidationdtl_Id_seq"'::regclass);


--
-- Data for Name: logvalidationdtl; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.logvalidationdtl ("Id", "CreatedDate", "FilePath", "TaskName", "TagNames", "RegExValue", "Status", "TaskType", selected_task_name, result_type, log_delimiter) FROM stdin;
1	2022-07-15 13:38:21	test_log_1622096744_1657892291.log	validation_task_2022715133754	IP\n	00(?=([^ ]*))\\1\n	Completed	Upload	task2022715131727	Regular Expression	\\n
2	2022-07-15 13:40:07	hari_log_0_5MB_10linesonly_1622099585_1657892399.txt	validation_task_2022715133946	IP\n	00(?=([^ ]*))\\1\n	Completed	Upload	task2022715131727	Regular Expression	\\n
\.


--
-- Data for Name: regex_tasks; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.regex_tasks (task_name, task_description, results, exec_log, status, log_file_name, log_delimiter, training_type, "task_CreatedDate", "task_CompletedOn") FROM stdin;
task2022718152550	testing_clouddb	{"result":"[{\\"IP\\":{\\"solutionJAVA\\":\\"00[^ ]*+\\",\\"solutionJS\\":\\"00(?=([^ ]*))\\\\\\\\1\\",\\"extrainfo\\":{\\"Training F-measure\\":1,\\"Validation F-measure\\":1,\\"Validation Recall\\":1,\\"Learning Char precision\\":1,\\"Training Recall\\":1,\\"Validation Char recall\\":1,\\"Learning F-measure\\":1,\\"Learning Recall\\":1,\\"Validation Char precision\\":1,\\"Validation Precision\\":1,\\"Training Char recall\\":1,\\"Learning Precision\\":1,\\"Training Precision\\":1,\\"Training Char precision\\":1,\\"Learning Char recall\\":1}}}]","status":"completed"}	[>                   ] 0.00%  of IP | 0/32 | ETA: 4 h, 27 m, 43 s\n\n[==>                 ] 10.80%  of IP | 3/32 | ETA: 0 h, 1 m, 54 s\n\n[====>               ] 20.40%  of IP | 6/32 | ETA: 0 h, 1 m, 41 s\n\n[======>             ] 30.10%  of IP | 9/32 | ETA: 0 h, 1 m, 7 s\n\n[========>           ] 40.10%  of IP | 12/32 | ETA: 0 h, 1 m, 16 s\n\n[==========>         ] 50.60%  of IP | 15/32 | ETA: 0 h, 1 m, 3 s\n\n[============>       ] 60.10%  of IP | 17/32 | ETA: 0 h, 1 m, 3 s\n\n[==============>     ] 70.10%  of IP | 20/32 | ETA: 0 h, 0 m, 57 s\n\n[================>   ] 80.10%  of IP | 24/32 | ETA: 0 h, 0 m, 38 s\n\n[==================> ] 90.10%  of IP | 28/32 | ETA: 0 h, 0 m, 22 s\n\nCompleted the job execution	completed	hari_log_0_5MB_10linesonly_1622099585.txt	\\n	Regular Expression	2022-07-18 15:26:07.728775+00	2022-07-18 16:00:17.786291
\.


--
-- Data for Name: tag_data; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.tag_data (tag_name, task_name, is_predefined, predefined_tag_json_format) FROM stdin;
IP	task2022718152550	0	\N
\.


--
-- Data for Name: tag_selection; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.tag_selection (task_name, log_line_no, tag_id, tag_name, selected_text, text_start, text_end) FROM stdin;
task2022718152550	1	1	IP	00:00:00.40	0	11
task2022718152550	10	1	IP	00:00:12.27	0	11
task2022718152550	2	1	IP	00:00:01.13	0	11
task2022718152550	3	1	IP	00:00:03.37	0	11
task2022718152550	4	1	IP	00:00:04.10	0	11
task2022718152550	5	1	IP	00:00:06.33	0	11
task2022718152550	6	1	IP	00:00:07.07	0	11
task2022718152550	7	1	IP	00:00:08.55	0	11
task2022718152550	8	1	IP	00:00:09.30	0	11
task2022718152550	9	1	IP	00:00:10.03	0	11
\.


--
-- Data for Name: uploaded_log_data; Type: TABLE DATA; Schema: public; Owner: decdpdev
--

COPY public.uploaded_log_data (log_line_no, task_name, log_data, is_marked) FROM stdin;
1	task2022718152550	00:00:00.40 Old version Trek data lose. Only receive 3 parameters	1
2	task2022718152550	00:00:01.13 SRG: check gasline 4 On	1
3	task2022718152550	00:00:03.37 Old version Trek data lose. Only receive 2 parameters	1
4	task2022718152550	00:00:04.10 Old version Trek data lose. Only receive 8 parameters	1
5	task2022718152550	00:00:06.33 Old version Trek data lose. Only receive 2 parameters	1
6	task2022718152550	00:00:07.07 Old version Trek data lose. Only receive 7 parameters	1
7	task2022718152550	00:00:08.55 Old version Trek data lose. Only receive 9 parameters	1
8	task2022718152550	00:00:09.30 Old version Trek data lose. Only receive 2 parameters	1
9	task2022718152550	00:00:10.03 Old version Trek data lose. Only receive 5 parameters	1
10	task2022718152550	00:00:12.27 Old version Trek data lose. Only receive 1 parameters	1
\.


--
-- Name: logvalidationdtl_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: decdpdev
--

SELECT pg_catalog.setval('public."logvalidationdtl_Id_seq"', 2, true);


--
-- Name: logvalidationdtl logvalidationdtl_pkey; Type: CONSTRAINT; Schema: public; Owner: decdpdev
--

ALTER TABLE ONLY public.logvalidationdtl
    ADD CONSTRAINT logvalidationdtl_pkey PRIMARY KEY ("Id");


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

