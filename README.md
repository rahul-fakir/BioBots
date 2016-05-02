# Application Website For BioBots Internship

The final site is hosted on Byte Internet Services (free account): http://biobots.byethost24.com

##Data Set
The given .json dataset was parsed and stored in a remotely hosted MySQL database in a single table as any relationships/normalization was going to drastically improve performance. 

#Access
The front-end interface begins with a login screen through which both users and administrators can access the data tool. The email address for admin users is admin@admin.com whilst users use their respective email addresses stored in the dataset. Both users and administrators access the same website however certain features are inaccessible for users as opposed to administrators thus reducing the need for two separate front-end sites.

#Admin Features
- Dashboard: View overall statistics of all prints in calculated and graphic form User Search: View the same stats specific to each user as well as access each user's print history

#User Features
- Dashboard: View overall statistics of the logged in user in addition to his/her print history

#External Libraries
- Graphic Representation: Due to time constraints all graphs are depicted using CanvasJS (free version) (http://canvasjs.com)
- CSS: Due to time constraints, MetrializeCSS was used for the front-end design (http://materializecss.com)

#Unimplemented Features:
Due to time constraints, median/50th percentile, 25 and 75th percentile calculations were not implemented however these can easily be done through SQL by counting and accessing the rounded 25th, 50th and 75th record respectively.

#Extension
Given more time, the following could be implemented:
- Interactive graphs
- User defined statistics searches (compare variable x to y)
- UI makeover. The current UI is very minimal and serves the purpose of a basic front end interface
- Improved security in terms of logging in and data access

