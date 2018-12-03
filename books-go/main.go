package main

import (
	"github.com/gin-contrib/cors"
	"flag"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

const (
	// Version program version
	Version = "0.1"
)

var db *gorm.DB
var err error
var opts Options

var usageStr = `
Usage: spc-books [options]
Common Options:
	-host <host>        the local network interface at which to listen (default: 0.0.0.0)
	-port <port>        TCP port at which the files will be served (default: 3010)
	-dialect <dialect>  DB Dialect (default: sqlite3)
	-addr <addr>        DB Address (default: ./spc.db)
`

// Options options
type Options struct {
	Host    string
	Port    int
	Dialect string
	Addr    string
}

// Book book
type Book struct {
	ID        uint
	Author    string
	Title     string
	Content   string
	CreatedAt time.Time
	UpdatedAt time.Time
}

func usage() {
	fmt.Printf("%s\n", usageStr)
	os.Exit(0)
}

func main() {
	flag.StringVar(&opts.Host, "host", "0.0.0.0", "Http host")
	flag.IntVar(&opts.Port, "port", 3010, "Http port")
	flag.StringVar(&opts.Dialect, "dialect", "sqlite3", "DB Dialect")
	flag.StringVar(&opts.Addr, "addr", "./spc.db", "DB Address")
	flag.Usage = usage
	flag.Parse()

	// const dialect = "sqlite3"
	// const addr = "./gorm.db"

	// const dialect = "postgres"
	// const addr = "postgresql://maxroach@localhost:26257/spc?sslmode=disable"
	db, err = gorm.Open(opts.Dialect, opts.Addr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	db.AutoMigrate(&Book{})

	r := gin.Default()

	// cors
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowHeaders = []string{"Origin", "Authorization", "Content-Type"}
	config.AllowCredentials = true
	r.Use(cors.New(config))

	r.GET("/books", GetBooks)
	r.GET("/books/:id", GetBook)
	r.POST("/books", CreateBook)
	r.PUT("/books/:id", UpdateBook)
	r.DELETE("/books/:id", DeleteBook)
	r.Run(fmt.Sprintf(":%d", opts.Port))
}

// DeleteBook DELETE /books/:id
func DeleteBook(c *gin.Context) {
	id := c.Params.ByName("id")
	var book Book
	db.Where("id = ?", id).Delete(&book)
	c.JSON(204, gin.H{})
}

// UpdateBook PUT /books/:id
func UpdateBook(c *gin.Context) {
	var book Book
	id := c.Params.ByName("id")

	if err := db.Where("id = ?", id).First(&book).Error; err != nil {
		c.AbortWithStatus(404)
		log.Println(err)
	}
	c.BindJSON(&book)

	db.Save(&book)
	c.JSON(200, book)
}

// CreateBook POST /books
func CreateBook(c *gin.Context) {
	var book Book
	c.BindJSON(&book)

	db.Create(&book)
	c.JSON(201, book)
}

// GetBook GET /books/:id
func GetBook(c *gin.Context) {
	id := c.Params.ByName("id")
	var book Book
	if err := db.Where("id = ?", id).First(&book).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.JSON(200, book)
	}
}

// GetBooks GET /books
func GetBooks(c *gin.Context) {
	var books []Book
	if err := db.Limit(10000).Order("created_at desc").Find(&books).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.JSON(200, books)
	}
}
