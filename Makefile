
all: main.css index.html

main.css: main.styl
	stylus < $< > $@

index.html: index.jade
	jade < $< > $@
