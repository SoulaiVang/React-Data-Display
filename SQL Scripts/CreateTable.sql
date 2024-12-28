USE CodeChallengeData

CREATE TABLE Materials (
	Id INT IDENTITY (1, 1) PRIMARY KEY,
	Mfr NVARCHAR(255) NOT NULL,
	TypeName NVARCHAR(255) NOT NULL,
	TypeId INT NOT NULL,
	StyleName NVARCHAR(255) NOT NULL,
	StyleId NVARCHAR(255),
	ColorNumber INT,
	ColorName NVARCHAR(255) NOT NULL,
	Size NVARCHAR(255) NOT NULL
);