/****** Object:  Table [dbo].[Anomaly_Input_Files]    Script Date: 8/24/2022 6:43:39 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Anomaly_Input_Files](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Title_Name] [nvarchar](max) NOT NULL,
	[File_Name] [nvarchar](max) NOT NULL,
	[Uploaded_Date] [datetime] NOT NULL,
	[Datasource_type] [varchar](200) NULL,
 CONSTRAINT [PK__Anomaly___3214EC272651BA17] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

