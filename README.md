# rhtmlLabeledScatter
An HTML widget that creates a labeled scatter plot

# Installation in R

1. `library(devtools)`
1. `install_github('Displayr/rhtmlLabeledScatter')`

Simplest Example to verify installation:

```
library(rhtmlLabeledScatter)
coords <- structure(c(-0.242824578883389, 0.447982869795063, 0.471121043396925,
0.464537497309872, -0.0913332694950237, -1.2733742886416, -0.500402183998914,
-0.27373105043976, -1.31538815485031, 0.037206733329165, -0.0787671942486661,
0.488530282325173, -0.29457007350688, -0.235625518884957, 0.601327833549599,
0.287370010414348, -0.923056165508813, 0.453772049498003, -0.25000257344162,
-0.202539757759669, 0.112245635990019, 0.132030273935906, 0.146363526885915,
-0.537816212784355, 0.466468539885024, -0.497665196949348, -0.261639180363143,
0.368144823830639, -0.23730729602076, -0.293995121319046, 0.176112525700419,
-0.419761150156407, -0.0573900558313915, 0.274787466614528, 0.0802524115772252,
0.233157762736366, 0.122368362334109, -0.454640909480694), .Dim = c(19L,
2L), .Dimnames = list(c("Coke", "V", "Red Bull", "Lift Plus",
"Diet.Coke", "Fanta", "Lift", "Pepsi", "Kids", "Teens", "Enjoy life",
"Picks you up", "Refreshes", "Cheers you up", "Energy", "Up-to-date",
"Fun", "When tired", "Relax"), c("Dim1", "Dim2")))


column.labels <- c("Dimension 1 (77.5%)", "Dimension 2 (17%)")

groups <- c("Brand", "Brand", "Brand", "Brand", "Brand", "Brand", "Brand",
"Brand", "Attribute", "Attribute", "Attribute", "Attribute",
"Attribute", "Attribute", "Attribute", "Attribute", "Attribute",
"Attribute", "Attribute")

print(LabeledScatter(X = coords[, 1],
                       Y = coords[, 2],
                       label = rownames(coords),
                       group = groups,
                       fixed.aspect = TRUE,
                       title = "Correspondence analysis",
                       x.title = column.labels[1],
                       y.title = column.labels[2],
                       axis.font.size = 8,
                       labels.font.size = 12,
                       title.font.size = 20,
                       y.title.font.size = 16,
                       x.title.font.size = 16))
```

# Local Installation to Develop/Contribute

**Prerequisites** - For help installing prerequisites see the `Prequisite Installation Help` section below

1. nodejs >= 5.0
1. python 2.7 - one of the nodejs libraries needs python during the installation process

## Installing the rhtmlLabeledScatter code

1. On windows open git shell (or install it first). On OSX open terminal
    1. Tim note : Type enter when prompted for a passphrase when opening git shell
1. Change directory to the place where you put git projects
    1. Tim note : Do not use a Dropbox synced directory. There will be 1000's of files created by `npm install` and your computer will catch fire
1. type `git clone git@github.com:Displayr/rhtmlLabeledScatter.git` ENTER
1. type `cd rhtmlLabeledScatter` ENTER
1. type `npm install` ENTER
    1. `npm install` is noisy and will print several warnings about `UNMET` and `DEPRECATED`. Ignore these and only make note of errors. If it fails, try running it again.
1. type `gulp serve` ENTER
    1. If `gulp serve` does not work try `./node_modules/.bin/gulp serve`. To correct this and to make your nodejs life easier you should add `./node_modules/.bin` to your PATH. Consult the Internet for instructions on how to do so on your OS of choice.

If this worked, then the `gulp serve` command opened your browser and you are looking at `http://localhost:9000`. You should see a page listing a bunch of links to examples, each example shows the simple 4 square widget template. These examples are defined in the [features.json file](theSrc/features/features.json).

Choose an example or add another example to [features.json](theSrc/features/features.json). When changes to any file in `./theSrc` are saved, the browser will automatically reload.

## Prerequisite Installation Help

### Install nodejs on OSX

1. Install brew by following instructions here : http://brew.sh/
1. Install nvm (node version manager) by running `brew install nvm`
1. Install node by running `nvm install 5.8.0` on the terminal

### Install nodejs on Windows

1. Setup nodist. https://github.com/marcelklehr/nodist and find the link to the official installer.
1. Open the command prompt. Type: `nodist v5.8.0`
1. Type `node -v` and verify the version is correct

### Python on OSX - it should come installed. If not

1. Install brew (if not done already) by following instructions here : http://brew.sh/
1. Install python by running `brew install python` on the terminal - make sure you get 2.7

### Python on Windows

1. Download version 2.7 from https://www.python.org/downloads/

# Developing and Contributing

See docs on the [htmlwidget_build_system](docs/htmlwidget_build_system.md) to understand what gulp tasks are available and to understand the role of each file in the project. Here are a few important notes (both detailed in the htmlwidget_build_system docs) you must keep in mind:

1. The last thing you do before committing is run `gulp build` to ensure all the autogenerated files are up to date.
2. (With some exceptions) ONLY EDIT THINGS IN these directories: `theSrc`, and `docs` !! Many of the other files are auto generated based on the contents of `theSrc`. As an example, if you edit `R/rhtmlTemplate.R` and then run `gulp build` your changes will be DELETED FOREVER!, because `R/rhtmlTemplate.R` is just a copy of `theSrc/R/htmlwidget.R`. See [htmlwidget_build_system](docs/htmlwidget_build_system.md) for more details.

# Docs

**Doc manifest**
* [htmlwidget build system](docs/htmlwidget_build_system.md) - gulp task descriptions and file role breakdown
* [extending the template](docs/extending_the_template.md) - instructions on using the template to create a new htmlwidget project
* [how the code works](docs/how_the_code_works.md) - a walkthrough of how the rhtmlTemplate and its successors actually work

## R docs

The [R file](theSrc/R/htmlwidget.R) has inline documentation that is compiled into an [Rd file](man/template.Rd). This documentation can be accessed from R using the following sequence:

```
install_github("Displayr/rhtmlTemplate")
library(rhtmlTemplate)
help(template)
```

## R Examples

```
library(rhtmlLabeledScatter)
bigmac.x <- c(56428, 47899, 85198, 21247, 65149, 53149, 25632, 48317, 67445, 47031, 24067, 51119, 46896, 47608, 38216, 26210, 40676, 45451, 30895, 43800, 45723, 36601, 41018, 34899, 47229, 58731, 36152, 27624, 25895, 27995, 40838, 35811, 18370, 33495, 26773, 22459, 23556, 13215, 20188, 8278, 13801, 16346, 11135, 13851, 14980, 11194, 12187, 15366, 18558, 15941, 11069, 7348, 6266, 5964, 4886)
bigmac.y <- c(2.48, 2.15, 4.01, 1.08, 3.54, 3.20, 1.99, 3.80, 5.51, 3.96, 2.05, 4.40, 4.17, 4.30, 3.47, 2.42, 3.94, 4.44, 3.06, 4.35, 4.60, 3.86, 4.51, 3.85, 5.23, 6.59, 4.22, 3.36, 3.15, 3.41, 5.06, 4.62, 2.37, 4.38, 3.69, 3.35, 3.53, 2.10, 3.53, 1.57, 2.79, 3.38, 2.36, 3.04, 3.40, 2.59, 3.02, 4.12, 5.04, 4.78, 3.63, 2.82, 2.41, 2.69, 3.58)
bigmac.g <- c("< 5\u2030 of GDP", "< 5\u2030 of GDP", "< 5\u2030 of GDP", "Between 5\u2030 and < 10\u2030 of GDP", "Between 5\u2030 and < 10\u2030 of GDP", "Between 5\u2030 and < 10\u2030 of GDP", "Between 5\u2030 and < 10\u2030 of GDP", "Between 5\u2030 and < 10\u2030 of GDP", "Between 5\u2030 and < 10\u2030 of GDP", "Between 5\u2030 and < 10\u2030 of GDP", "Between 5\u2030 and < 10\u2030 of GDP", "Between 5\u2030 and < 10\u2030 of GDP", "Between 5\u2030 and < 10\u2030 of GDP", "Between 5\u2030 and < 10\u2030 of GDP", "Between 5\u2030 and < 10\u2030 of GDP", "Between 5\u2030 and < 10\u2030 of GDP", "Between 10\u2030 and < 20\u2030 of GDP", "Between 10\u2030 and < 20\u2030 of GDP", "Between 10\u2030 and < 20\u2030 of GDP", "Between 10\u2030 and < 20\u2030 of GDP", "Between 10\u2030 and < 20\u2030 of GDP", "Between 10\u2030 and < 20\u2030 of GDP", "Between 10\u2030 and < 20\u2030 of GDP", "Between 10\u2030 and < 20\u2030 of GDP", "Between 10\u2030 and < 20\u2030 of GDP", "Between 10\u2030 and < 20\u2030 of GDP", "Between 10\u2030 and < 20\u2030 of GDP", "Between 10\u2030 and < 20\u2030 of GDP", "Between 10\u2030 and < 20\u2030 of GDP", "Between 10\u2030 and < 20\u2030 of GDP", "Between 10\u2030 and < 20\u2030 of GDP", "Between 10\u2030 and < 20\u2030 of GDP", "Between 10\u2030 and < 20\u2030 of GDP", "Between 10\u2030 and < 20\u2030 of GDP", "Between 10\u2030 and < 20\u2030 of GDP", "Between 10\u2030 and < 20\u2030 of GDP", "Between 10\u2030 and < 20\u2030 of GDP", "Between 10\u2030 and < 20\u2030 of GDP", "Between 10\u2030 and < 20\u2030 of GDP", "Between 10\u2030 and < 20\u2030 of GDP", "> 20\u2030 of GDP", "> 20\u2030 of GDP", "> 20\u2030 of GDP", "> 20\u2030 of GDP", "> 20\u2030 of GDP", "> 20\u2030 of GDP", "> 20\u2030 of GDP", "> 20\u2030 of GDP", "> 20\u2030 of GDP", "> 20\u2030 of GDP", "> 20\u2030 of GDP", "> 20\u2030 of GDP", "> 20\u2030 of GDP", "> 20\u2030 of GDP", "> 20\u2030 of GDP")
bigmac.df <- data.frame(bigmac.x, bigmac.y, bigmac.g)
rownames(bigmac.df) <- c("Hong Kong", "Taiwan", "Singapore", "Uruguay", "UAE", "Saudi Arabia", "Malaysia", "Netherlands", "Norway", "Austria", "Russia", "Ireland", "Germany", "Australia", "Japan", "Poland", "Britain", "Denmark", "Czech Republic", "Belgium", "Canada", "South Korea", "France", "Spain", "Sweden", "Switzerland", "New Zealand", "Portugal", "Hungary", "Estonia", "Finland", "Italy", "Mexico", "Israel", "Greece", "Argentina", "Chile", "South Africa", "Turkey", "Ukraine", "China", "Venezuela", "Indonesia", "Colombia", "Thailand", "Egypt", "Peru", "Costa Rica", "United States", "Brazil", "Sri Lanka", "Philippines", "India", "Vietnam", "Pakistan")
bigmac.c <- c(rgb(0, 176, 80, max = 255), rgb(137, 113, 13, max = 255), rgb(237, 125, 49, max = 255), rgb(255, 0, 0, max = 255))
LabeledScatter(X = as.numeric(bigmac.df[, 1]),
              Y = as.numeric(bigmac.df[, 2]),
              colors = bigmac.c,
              label = rownames(bigmac.df),
              group = bigmac.df[, 3],
              point.radius = 4,
              title = "Big Mac prices (2016) -vs- GDP per person (by country (2015))",
              labels.font.color = rgb(0, 0, 255, max = 255),
              y.title = "BigMac Price",
              x.title = "GDP per person",
              x.prefix = "$",
              y.prefix = "$",
              x.decimals = 0,
              y.decimals = 0,
              origin = FALSE,
              legend.show = FALSE,
              y.bounds.minimum = 0,
              y.bounds.maximum = 7,
              y.bounds.units.major = 1,
              x.bounds.minimum = 0,
              x.bounds.maximum = 90000,
              x.bounds.units.major = 10000)
```

```
coords <- structure(c(1.20717678273271, -0.358889576943445, -0.367284599847411, 
0.990595089926661, -0.519827458998618, -0.250292165916519, -0.19576676936709, 
-0.430238037160928, -0.534031839025636, -0.230483857439397, 0.977544489275776, 
-0.0145085087387522, 0.061685015783486, -0.136918988930853, 1.36927458084186, 
-0.593931432862893, -0.0228270116573135, -0.347388639852981, 
0.523044026866707, -0.075687207952628, -0.390361214684736, 0.666436196168659, 
-0.318827446504028, -0.420829887695947, -0.000403618372313634, 
-0.457826124967497, -0.177012800372638, 0.612453744937109, 0.752924212816244, 
-0.467713414118639, -0.129156630692344, 0.0199370131787323), .Dim = c(16L, 
2L), .Dimnames = list(c("Coke", "Diet Coke", "Coke Zero", "Pepsi", 
"Diet Pepsi", "Pepsi Max", "None of these", "Feminine", "Health-conscious", 
"Innocent", "Older", "Open to new experiences", "Rebellious", 
"Sleepy", "Traditional", "Weight-conscious"), c("Dim1", "Dim2"
)))
groups <- c("Brands", "Brands", "Brands", "Brands", "Brands", "Brands", 
"Brands", "Attributes", "Attributes", "Attributes", "Attributes", 
"Attributes", "Attributes", "Attributes", "Attributes", "Attributes"
)
colors <- c("#5B9BD5", "#ED7D31")
column.labels <- c("Dimension 1 (62.4%)", "Dimension 2 (24.2%)")
rhtmlLabeledScatter::LabeledScatter(X = coords[, 1],
Y = coords[, 2],
label = rownames(coords),
group = groups,
colors = colors,
fixed.aspect = TRUE,
title = "Correspondence analysis",
x.title = column.labels[1],
y.title = column.labels[2],
axis.font.size = 8,
labels.font.size = 12,
title.font.size = 20,
y.title.font.size = 16,
x.title.font.size = 16)
```

Fixed aspect ratio example:
```
library(rhtmlLabeledScatter)
 
X <- structure(c(-0.432905868184257, -0.693333270946253, -0.759205446468168,
0.365804297093451, -0.0809446140374646, 0.485215412599398, -0.221894905796498,
0.420002156905969, 0.21825659158202, -0.134771028445111, 0.133565377235242,
-0.0750160438174591, 0.127601145997133, -0.249727663633664, 0.543745260097428,
-1.18852527816253, 0.739928412895668, -0.228348435358677, 0.3317570110704,
0.629290842341913, 0.411488471989772, -0.600882653660674, 0.374423391820461,
0.42699632374155, 0.234078846118916, -0.273672896492856, -0.810474419247493
), .Names = c("AAPT/Cellular One", "New Tel", "One-tel", "Optus",
"Orange (Hutchison)", "Telstra (Mobile Net)", "Virgin Mobile",
"Vodafone", "Bureaucratic", "Slow service", "Friendly", "Low prices",
"Fashionable", "Unfashionable", "Reliable", "Here today, gone tomorrow",
"Good coverage", "Network often down", "The best phones", "Conveniently located stores",
"High prices", "Unreliable", "Meet all my communication needs",
"Leaders in mobile phone technology", "I like them", "I hate them",
"Don't know much about them"))
 
Y <- structure(c(-0.196774100144866, -0.0809771977755882, 0.445169068736481,
-0.017959017172487, -0.219998595306152, 0.281132046825253, -0.377854432575485,
-0.122436041939718, 0.266697343245676, 0.109247603851489, -0.290633123889276,
-0.343742241256154, -0.395197456128867, 0.106216380764122, 0.114825455485268,
0.566580664016157, 0.26687534732185, -0.0394092244494879, -0.0873099302299906,
0.0471460218946446, 0.278105188886833, 0.242649731911665, 0.0027300385224323,
0.035858164179279, -0.155592787664005, 0.0391250477465646, -0.488239535858155
), .Names = c("AAPT/Cellular One", "New Tel", "One-tel", "Optus",
"Orange (Hutchison)", "Telstra (Mobile Net)", "Virgin Mobile",
"Vodafone", "Bureaucratic", "Slow service", "Friendly", "Low prices",
"Fashionable", "Unfashionable", "Reliable", "Here today, gone tomorrow",
"Good coverage", "Network often down", "The best phones", "Conveniently located stores",
"High prices", "Unreliable", "Meet all my communication needs",
"Leaders in mobile phone technology", "I like them", "I hate them",
"Don't know much about them"))
 
label <- c("AAPT/Cellular One", "New Tel", "One-tel", "Optus", "Orange (Hutchison)",
"Telstra (Mobile Net)", "Virgin Mobile", "Vodafone", "Bureaucratic",
"Slow service", "Friendly", "Low prices", "Fashionable", "Unfashionable",
"Reliable", "Here today, gone tomorrow", "Good coverage", "Network often down",
"The best phones", "Conveniently located stores", "High prices",
"Unreliable", "Meet all my communication needs", "Leaders in mobile phone technology",
"I like them", "I hate them", "Don't know much about them")
 
groups <- c("Rows", "Rows", "Rows", "Rows", "Rows", "Rows", "Rows", "Rows",
"Columns", "Columns", "Columns", "Columns", "Columns", "Columns",
"Columns", "Columns", "Columns", "Columns", "Columns", "Columns",
"Columns", "Columns", "Columns", "Columns", "Columns", "Columns",
"Columns")
 
LabeledScatter(X = X,
                       Y = Y,
                       Z = NULL,
                       label = label,
                       group = groups,
                       colors = c("#5B9BD5", "#ED7D31"),
                       fixed.aspect = TRUE,
                       title = "Correspondence analysis",
                       x.title = "Dimension 1 (65.8%)",
                       y.title = "Dimension 2 (18.5%)",
                       z.title = "",
                       axis.font.size = 10,
                       labels.font.size = 14,
                       title.font.size = 20,
                       legend.font.size = 15,
                       y.title.font.size = 16,
                       x.title.font.size = 16)
```

Trend lines example:

```
library(rhtmlLabeledScatter)
trendplot.x <- c(1,2,3,4,5,6,7,8,11,11)
trendplot.y <- c(0,3,0,1,9,2,2,4,0,1)
trendplot.group <- c("IBM", "IBM", "IBM", "IBM", "Google", "Google", "Google", "Google", "Oracle", "Oracle")
trendplot.df <- data.frame(trendplot.x, trendplot.y, trendplot.group)
rownames(trendplot.df) <- c("https://gigaom.com/wp-content/uploads/sites/1/2010/10/ibm_logo.gif", "2", "3", "4", "5", "6", "7", "8", "9", "11")
LabeledScatter(X = as.numeric(trendplot.df[,1]),
               Y = as.numeric(trendplot.df[,2]),
               label = rownames(trendplot.df),
               group = trendplot.df[,3],
               trend.lines.show = TRUE,
               trend.lines.line.thickness = 1,
               trend.lines.point.size = 0)
```

Bubble plot example:

```
library(rhtmlLabeledScatter)
LabeledScatter(X=1:10, Y=1:10, Z=1:10, label=letters[1:10], group=rep(c('a','b'),each=5), legend.font.family="Courier", legend.font.color="red", legend.font.size=8, legend.bubble.font.family="Courier", legend.bubble.font.color="blue", legend.bubble.font.size=5, z.title="Bubble", legend.bubble.title.font.color = "green", legend.bubble.title.font.family="Courier", legend.bubble.title.font.size = 30)
```