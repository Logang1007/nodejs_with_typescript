USE [master]
GO
/****** Object:  Database [mrpLogging]    Script Date: 08/11/2019 10:20:38 ******/
CREATE DATABASE [mrpLogging] ON  PRIMARY 
( NAME = N'mrpLogging', FILENAME = N'F:\MSSQL10_50.MONOSYLLABIX\MSSQL\DATA\mrpLogging.mdf' , SIZE = 3072KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'mrpLogging_log', FILENAME = N'F:\Log\SQLData\mrpLogging_log.ldf' , SIZE = 1024KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [mrpLogging] SET COMPATIBILITY_LEVEL = 100
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [mrpLogging].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [mrpLogging] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [mrpLogging] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [mrpLogging] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [mrpLogging] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [mrpLogging] SET ARITHABORT OFF 
GO
ALTER DATABASE [mrpLogging] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [mrpLogging] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [mrpLogging] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [mrpLogging] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [mrpLogging] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [mrpLogging] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [mrpLogging] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [mrpLogging] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [mrpLogging] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [mrpLogging] SET  DISABLE_BROKER 
GO
ALTER DATABASE [mrpLogging] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [mrpLogging] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [mrpLogging] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [mrpLogging] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [mrpLogging] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [mrpLogging] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [mrpLogging] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [mrpLogging] SET RECOVERY FULL 
GO
ALTER DATABASE [mrpLogging] SET  MULTI_USER 
GO
ALTER DATABASE [mrpLogging] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [mrpLogging] SET DB_CHAINING OFF 
GO
EXEC sys.sp_db_vardecimal_storage_format N'mrpLogging', N'ON'
GO
USE [mrpLogging]
GO
/****** Object:  User [SPECIALTY\LOGGOO$]    Script Date: 08/11/2019 10:20:39 ******/
CREATE USER [SPECIALTY\LOGGOO$] FOR LOGIN [SPECIALTY\LOGGOO$] WITH DEFAULT_SCHEMA=[dbo]
GO
/****** Object:  User [mrplogging]    Script Date: 08/11/2019 10:20:39 ******/
CREATE USER [mrplogging] FOR LOGIN [mrplogging] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [SPECIALTY\LOGGOO$]
GO
ALTER ROLE [db_owner] ADD MEMBER [mrplogging]
GO
/****** Object:  Table [dbo].[LogApplication]    Script Date: 08/11/2019 10:20:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LogApplication](
	[LogApplicationId] [int] IDENTITY(1,1) NOT NULL,
	[SecurityApplicationId] [nvarchar](255) NULL,
	[Description] [nvarchar](500) NULL,
	[IsActive] [bit] NOT NULL,
	[DateAdded] [datetime] NOT NULL,
	[UserAdded] [nvarchar](255) NOT NULL,
 CONSTRAINT [PK_LogApplication] PRIMARY KEY CLUSTERED 
(
	[LogApplicationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LogCode]    Script Date: 08/11/2019 10:20:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LogCode](
	[LogCodeId] [bigint] IDENTITY(1,1) NOT NULL,
	[LogApplicationId] [int] NOT NULL,
	[Code] [nvarchar](100) NOT NULL,
	[Description] [nvarchar](1000) NULL,
	[WikiLink] [nvarchar](2000) NULL,
	[DateAdded] [datetime] NOT NULL,
	[UserAdded] [nvarchar](255) NOT NULL,
 CONSTRAINT [PK_LogCode] PRIMARY KEY CLUSTERED 
(
	[LogCodeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [IX_LogCode] UNIQUE NONCLUSTERED 
(
	[Code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LogData]    Script Date: 08/11/2019 10:20:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LogData](
	[LogDataId] [bigint] IDENTITY(1,1) NOT NULL,
	[LogSeverityId] [int] NOT NULL,
	[LogTypeId] [int] NOT NULL,
	[Code] [nvarchar](100) NOT NULL,
	[ModuleName] [nvarchar](500) NOT NULL,
	[Request] [nvarchar](max) NULL,
	[Response] [nvarchar](max) NULL,
	[Data] [nvarchar](max) NULL,
	[DateAdded] [datetime] NOT NULL,
	[UserAdded] [nvarchar](255) NOT NULL,
 CONSTRAINT [PK_LogData] PRIMARY KEY CLUSTERED 
(
	[LogDataId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LogSeverity]    Script Date: 08/11/2019 10:20:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LogSeverity](
	[LogSeverityId] [int] IDENTITY(1,1) NOT NULL,
	[Description] [nvarchar](255) NOT NULL,
 CONSTRAINT [PK_LogSeverity] PRIMARY KEY CLUSTERED 
(
	[LogSeverityId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LogType]    Script Date: 08/11/2019 10:20:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LogType](
	[LogTypeId] [int] IDENTITY(1,1) NOT NULL,
	[Description] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_LogType] PRIMARY KEY CLUSTERED 
(
	[LogTypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[LogCode]  WITH CHECK ADD  CONSTRAINT [FK_LogCode_LogApplication] FOREIGN KEY([LogApplicationId])
REFERENCES [dbo].[LogApplication] ([LogApplicationId])
GO
ALTER TABLE [dbo].[LogCode] CHECK CONSTRAINT [FK_LogCode_LogApplication]
GO
ALTER TABLE [dbo].[LogData]  WITH CHECK ADD  CONSTRAINT [FK_LogData_LogCode] FOREIGN KEY([Code])
REFERENCES [dbo].[LogCode] ([Code])
GO
ALTER TABLE [dbo].[LogData] CHECK CONSTRAINT [FK_LogData_LogCode]
GO
ALTER TABLE [dbo].[LogData]  WITH CHECK ADD  CONSTRAINT [FK_LogData_LogSeverity] FOREIGN KEY([LogSeverityId])
REFERENCES [dbo].[LogSeverity] ([LogSeverityId])
GO
ALTER TABLE [dbo].[LogData] CHECK CONSTRAINT [FK_LogData_LogSeverity]
GO
ALTER TABLE [dbo].[LogData]  WITH CHECK ADD  CONSTRAINT [FK_LogData_LogType] FOREIGN KEY([LogTypeId])
REFERENCES [dbo].[LogType] ([LogTypeId])
GO
ALTER TABLE [dbo].[LogData] CHECK CONSTRAINT [FK_LogData_LogType]
GO
/****** Object:  StoredProcedure [dbo].[GetLogDataByApplicationId]    Script Date: 08/11/2019 10:20:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[GetLogDataByApplicationId]
	-- Add the parameters for the stored procedure here
	@LogApplicationId int
AS
BEGIN
	SELECT [LogDataId]
,la.Description as ApplicationName
      ,ld.[LogSeverityId]
	  ,ls.description as LogSeverity
      ,ld.[LogTypeId]
      ,lt.description as LogType
	  ,ld.[Code]
      ,[ModuleName]
      ,[Request]
      ,[Response]
      ,[Data]
      ,ld.[DateAdded]
      ,ld.[UserAdded]
  FROM [mrpLogging].[dbo].[LogData] ld
   left join  [mrpLogging].[dbo].LogSeverity ls on ld.LogSeverityId=ls.LogSeverityId
     left join  [mrpLogging].[dbo].LogType lt on ld.LogTypeId=lt.LogTypeId
  left join  [mrpLogging].[dbo].[LogCode] lc on ld.code=lc.code
  left join  [mrpLogging].[dbo].LogApplication la on lc.LogApplicationId = la.LogApplicationId

  where la.LogApplicationId=@LogApplicationId
END
GO
USE [master]
GO
ALTER DATABASE [mrpLogging] SET  READ_WRITE 
GO
