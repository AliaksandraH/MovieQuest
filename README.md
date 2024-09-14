# <div align="center"><img src="https://github.com/AliaksandraH/MovieQuest/blob/main/client/public/icons8-film-reel-64.png" height="45" alt="Logo" /> MovieQuest</div>

_MovieQuest_ is a full-featured web application for searching, saving, and managing movies and TV shows. The app allows users to browse current movies and series, filter them by various criteria, and keep track of watched content as well as their favorite movies and series.

_MovieQuest_ is a fully responsive application, which ensures proper display across different devices with varying screen resolutions. The interface automatically adjusts to screen sizes, making it convenient to use on smartphones, tablets, and desktops alike. This allows users to comfortably interact with the app on both mobile devices and PCs without losing any functionality.

## Functionality

1. **Popular Movies and TV Shows List**

    The app automatically loads a list of movies and TV shows that are popular at the moment. This list is updated in real-time and reflects current data based on ratings and user activity.
   
2. **Content Filtering**

   _MovieQuest_ offers a flexible filtering system that allows users to search for movies and series based on multiple criteria:
    - Genre
    - Release Year
    - Country of Production
    - Rating
    - And other parameters.
   All filters can be combined for precise search customization.

3. **Autocomplete Search**
   
    To simplify the search process, the app features an autocomplete system. As users start typing the title of a movie or series, a dropdown list with suggested options appears.

4. **Movie and Series Information Page**

    A separate page with detailed information is available for each movie or TV series:
    - Poster
    - Description
    - Directors
    - Writers
    - Release date
    - Ratings
    - And other details.

5. **User Registration and Authentication**

    _MovieQuest_ supports a user registration and authentication system. User data, such as movie lists and activity, is stored in a database, ensuring access to information when logging in from any device.

6. **Saving Movies and TV Shows**

    Users can save movies and series to two separate lists:
    - _Save_ — for movies/series the user plans to watch.
    - _Watched_ — for already watched movies/series.
   
    These lists are accessible through the user's personal pages.
   
7. **Activity Calendar**

    The app includes a built-in calendar that displays the days on which the user watched movies or series. This provides a visual way to track activity and see on which days different series or movies were completed.

## Technology Stack

_MovieQuest_ is developed using the following technologies and tools:

- **Frontend**:
    - **React**: the foundation of the user interface, supporting a component-based architecture and fast data rendering.
    - **Redux**: used for managing the app's state.
    - **React Router**: for page routing within the application.
    - **Styled-components/SCSS**: for styling the interface and flexible _CSS_ management.
- **Backend**:
    - **Node.js**: a server environment for handling requests.
    - **Express**: a web framework for building _APIs_ and managing routes.
    - **MongoDB**: a _NoSQL_ database for storing user information, saved, and watched movies/series.
- **API**:
    - **TMDB API**: used to retrieve data about movies and series.
 
## Deployment

The app is deployed and available at the following address: [MovieQuest](https://movie-quest-two.vercel.app/)

## Important!

If the app is not working, try enabling a **VPN**, as access to some data might be restricted in your region.

## Contact

If you have any questions or concerns, please feel free to contact me :) _aliaksandra.hurskaya@gmail.com_
