/****** Object:  Table [dbo].[Anomaly_Detection_Form]    Script Date: 8/24/2022 6:43:21 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Anomaly_Detection_Form](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Anomaly_ID] [int] NOT NULL,
	[Timeseries_Parameter] [nvarchar](50) NOT NULL,
	[Anomaly_Parameters] [nvarchar](max) NOT NULL,
	[Anomaly_Type] [nvarchar](50) NULL,
	[Anomaly_Interval] [nvarchar](50) NULL,
	[Result_JSON] [nvarchar](max) NULL,
	[Model_Name] [nvarchar](50) NULL,
	[Total_Row_Count] [int] NULL,
	[Anomaly_Row_count] [int] NULL,
	[Input_Type] [nchar](50) NULL,
 CONSTRAINT [PK_Anomaly_Form1] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

