CREATE TABLE blog ( id SERIAL PRIMARY KEY, author TEXT, url TEXT NOT NULL, title TEXT NOT NULL, likes INTEGER DEFAULT 0 );

INSERT INTO blog ( author, url, title, likes ) VALUES ( 'Arturs Canders', '/my-new-blog-post', 'My new blog post', 1 );
INSERT INTO blog ( author, url, title ) VALUES ( 'Felikss Kepss', '/my-new-blog-post-2', 'My new blog post 2' );

SELECT * FROM blog;