// query to find all books in a specific genre
db.books.find({
    genre: "Fiction"
})

// query to find books published after 1950
db.books.aggregate([
    { $match: { published_year: { $gt: 1950 } }}
])

//query to find books authored by Harper Lee
db.books.find({
    author: "Harper Lee"
})

// a query to update the price of the book The Hobbit
db.books.updateOne(
    {title: "The Hobbit"},
    { $set: { price: 30.99}}
)

// A query to delete a book titled "The Alchemist"
db.books.deleteOne({title: "The Alchemist"});

// a query to find books that are both in stock and published after 2010
db.books.aggregate([{
    $match:
    { in_stock: true,
     published_year: { $gt: 2010 }}
}])

// Using projection to return only the title, author, and price fields
db.books.aggregate([
    { $match:
    { in_stock: true,
     published_year: { $gt: 2010 }}
    },
    { $project: { title: 1 , author: 1, price: 1, _id: 0 }}
])

// implimenting sorting - ascending
db.books.aggregate([
    { $match:
    { in_stock: true,
     published_year: { $gt: 2010 }}
    },
    { $project: { title: 1 , author: 1, price: 1, _id: 0 }},
    { sort: { price: 1}}

])

// - descending
db.books.aggregate([
    { $match:
    { in_stock: true,
     published_year: { $gt: 2010 }}
    },
    { $project: { title: 1 , author: 1, price: 1, _id: 0 }},
    { sort: { price: -1}}

])

// using limit and skip methods to implement pagination 5books per page

db.books.find().skip(0).limit(5)
db.books.find().skip(5).limit(5)
db.books.find().skip(10).limit(5)



// Aggregation pipelines
//average price by genre
db.books.aggregate([
    {$group: { _id: "$genre", average_price: {$avg: "$price" } } } 
]);

// author with the most books 
db.books.aggregate([
    {
        $group: {
            _id: "$author",
            totalBooks: {$sum: 1}
        }
    },
    { $sort: { totalBooks: -1 }},
    {
        $limit: 1
    }
])

// Implementing a pipeline that groups books by publication decade and counts them
db.books.aggregate([
  {
    $project: {
      title: 1,
      decade: {
        $subtract: ["$published_year", 
        { $mod: ["$published_year", 10] }]
      }
    }
  },
  {
    $group: {
      _id: "$decade",
      count: { $sum: 1 }
    }
  },
  {
    $sort: { _id: 1 }  
  }
])


//INDEXING
// creating index on title
db.books.createIndex({ title: -1 })

// creating compond indexes
db.books.createIndex({ author:1, published_year: -1})