# Graviton Codebase Features and Functionalities Report

This document provides a comprehensive analysis of the features and functionalities available in the Graviton codebase, organized by major components.

## 1. Anomaly Detection
### Components: `ad-marshal`, `ads`
The anomaly detection module provides tools for identifying outliers and unusual patterns in various data sources.

*   **Datasource Management**:
    *   Support for multiple data sources: Local files (CSV), Databases (including MSSQL, PostgreSQL via Django models), and Apache Kafka topics.
    *   Unified interface for connecting to and retrieving data for analysis.
*   **Anomaly Detection Services**:
    *   **Azure Anomaly Detector**: Deep integration with Azure's Cognitive Services for cloud-based anomaly detection.
    *   **Graviton Anomaly Detection**: Implementation of custom, in-house anomaly detection algorithms.
    *   **Multivariate Anomaly Detection**: Capabilities to detect anomalies by analyzing multiple related variables simultaneously (primarily in `ads`).
*   **Visualization and Reporting**:
    *   Interactive charting of timeseries data with anomalies highlighted.
    *   Classification of anomalies for better categorization and root cause analysis.
*   **Configuration**:
    *   Granular control over detection parameters such as sensitivity, interval, and model selection.

## 2. Data Quality
### Components: `data_quality`, `marshal`, `griffin`
This module ensures that data is accurate, complete, and consistent across systems.

*   **Great Expectations (GE) Integration**:
    *   Provides a Django-based API wrapper around the Great Expectations library.
    *   **Expectation Suites**: Allows users to define, save, and manage sets of rules (expectations) for their datasets.
    *   **Checkpoints and Validations**: Defines validation workflows that can be run on-demand or as part of a pipeline.
*   **Data Profiling**:
    *   Automatic profiling of data assets to generate insights and suggested expectations.
    *   Visual reports of data distribution and quality metrics.
*   **Apache Griffin**:
    *   A dedicated, model-driven data quality service platform.
    *   Standardizes the process of defining DQ measures, execution, and reporting across multiple data systems (IoT, ML, etc.).

## 3. Data Generation and Anonymization
### Components: `datagenie`, `datagenie_2.0`, `datajinni`, `model_train`
Focused on the creation of synthetic data for testing and the protection of sensitive information.

*   **Synthetic Data Generation (SDV)**:
    *   Utilizes the Synthetic Data Vault (SDV) library to train models on real data and generate synthetic equivalents.
    *   Supports both single-table and complex relational data structures, maintaining referential integrity.
*   **Rule-Based Simulation**:
    *   Simulates device telemetry and events based on predefined rules.
    *   Integration with Azure IoT Hub and other cloud services for stream data simulation.
*   **Data Anonymization**:
    *   **Tabular Data Masking**: PII (Personally Identifiable Information) masking in CSV and JSON files using various strategies (Phone, Email, IP, etc.).
    *   **Image Anonymization**: Automated detection and blurring of faces or other sensitive areas within images.
*   **Image Simulation**:
    *   Generates synthetic image datasets by applying transformations such as rotation, shifting, flipping, shearing, and zooming to base images.

## 4. Logging, Monitoring, and Dashboarding
### Components: `airflow_log_observer`, `log_manager`, `databand`, `synergizer`, `synergizer_ver2.0`
Provides observability and monitoring for data pipelines and infrastructure.

*   **Airflow and Pipeline Monitoring**:
    *   **Airflow Log Observer**: Specialized tool for capturing and analyzing logs from Airflow clusters.
    *   **Databand (dbnd) Integration**: Core library for pipeline observability, tracking data lineage, and performance.
*   **Integrated Monitoring Stack**:
    *   **InfluxDB**: Integration for storing and querying time-series metrics.
    *   **Prometheus & Grafana**: Ready-to-use APIs and configurations for metric collection and dashboard visualization.
*   **Alerting and Forecasting**:
    *   Metric forecasting and anomaly detection within logs to proactively identify pipeline failures.

## 5. Data Management and Portals
### Components: `data_manager`, `datascope`, `semantico`, `semanticsss`
Centralized management and semantic access to data assets.

*   **Graviton Datascope Portal**:
    *   A centralized web-based interface for managing data resources and assets.
    *   **Automated Resource Deployment**: Integration with Terraform for provisioning Azure resources (like Kubernetes clusters) directly from the portal.
*   **Semantic Data Access**:
    *   Provides a semantic layer (`semantico`) for accessing data stored in ADLS (Azure Data Lake Storage).
    *   Allows for business-object-level mapping and querying of raw data.

## 6. Azure Function Integration
### Component: `cdp_function_app`
A collection of serverless functions for real-time data processing and machine learning.

*   **AION Predictions**: Machine learning models deployed as Azure Functions for real-time telemetry predictions.
*   **Stream & Storage Processing**:
    *   Functions for anonymizing data as it flows through streams or sits in storage.
    *   **Column Classification**: Automated classification of column types to aid in data governance and discovery.

## 7. Specialized Tools
### Components: `reconcile`, `reconciliation`, `refine`, `elixir`
Niche tools for specific data engineering tasks.

*   **Data Reconciliation**: Specialized processes to ensure data consistency when moving between different systems or processing stages.
*   **OpenRefine Integration**: Integration with the OpenRefine tool for advanced data cleaning, transformation, and reconciliation via its API.
*   **Regex Generation**: A Java-based regex generator (`elixir/regex_generator`) to help automate the creation of complex regular expressions for data parsing.
