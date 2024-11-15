<!-- Back to Top Link-->
<a name="readme-top"></a>


<br />
<div align="center">
  <h1 align="center">Phoenix Image</h1>

  <p align="center">
    <h3>Tugas Besar IF2110 Algoritma & Struktur Data ITB</h3>
    <h3>Content-Based Image Retrieval System (CBIR)</h3>
    <h3>Demo? Clone this!</h3>
    <br>
    <a href="https://github.com/NoHaitch/Tubes2_Algeo/issues">Report Bug</a>
    ·
    <a href="https://github.com/NoHaitch/Tubes2_Algeo/issues">Request Feature</a>
<br>
<br>

[![MIT License][license-shield]][license-url]

  </p>
</div>


<!-- CONTRIBUTOR -->
<div align="center" id="contributor">
  <strong>
    <h3>Dibuat oleh Kelompok 23 - Bjir Anak Nopal.</h3>
    <table align="center">
      <tr>
        <td>NIM</td>
        <td>Nama</td>
      </tr>
      <tr>
        <td>13522063</td>
        <td>Shazya Audrea Taufik</td>
      </tr>
      <tr>
        <td>13522071</td>
        <td>Bagas Sambega Rosyada</td>
      </tr>
      <tr>
        <td>13522091</td>
        <td>Raden Francisco Trianto Bratadiningrat</td>
      </tr>
    </table>
  </strong>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#general-information">General Information</a></li>
    <li><a href="#technologies-used">Technologies Used</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#screenshots">Screenshots</a></li>
    <li><a href="#setup">Setup</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#project-status">Project Status</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#special-thanks">Special Thanks</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>


<!-- EXTERNAL LINKS -->
## External Links

- [Link Spesifikasi dan Pedoman](https://docs.google.com/document/d/1HVDyywnUdNz9hStgx5ZLqHypK89hWH8qfERJOiDw6KA/edit)
- [Link Q&A](https://docs.google.com/spreadsheets/d/18SK0y6rL9ZQtNMRR83Vy-Z3VtycjyJQj6rhDf1633qM/edit#gid=0)
- [Link Data Kelompok](https://docs.google.com/spreadsheets/d/18SK0y6rL9ZQtNMRR83Vy-Z3VtycjyJQj6rhDf1633qM/edit#gid=1688564596)

<p align="right">(<a href="#readme-top">back to top</a>)</p>




<!-- GENERAL INFORMATION -->
## General Information
Phoenix Image a Content-Based Image Retrieval System made by Bjir Anak Nopal. This project is a for learning the aplication of Linier Algebra concept of Vector and cosine similarity. 
<!-- You don't have to answer all the questions - just the ones relevant to your project. -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- TECHNOLOGIES USED -->
## Technologies Used
### Front-End
- [Nextjs v14.0.1](https://nextjs.org/) 
- [Tailwindcss v3.3.5](https://tailwindcss.com/) 
- [Framer-motion v10.16.4](https://www.framer.com/motion/) 
- [react-webcam v7.2.0](https://www.npmjs.com/package/react-webcam) 

### Back-End
- [Express v4.18.2](https://expressjs.com/) 
- [Cors v2.8.5](https://www.npmjs.com/package/cors)
- [Multer v1.4.5-lts.1](https://www.npmjs.com/package/multer)
- 

### C++ library
- [json](https://github.com/nlohmann/json)
- [stb](https://github.com/nothings/stb)

### Other
- concurrently v8.2.2
- nodemon v3.0.1

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- FEATURES -->
## Features
### 1. Search using Color Data
  - stores cache
### 2. Search using Texture Data
### 3. Search using Web camera
  1. Manualy
  2. Automaticly

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- SCREEENSHOTS -->
## Screenshots
<div align="center">
<img src="./img/landing-page.png"  width="440" alt="Landing Page">
<img src="./img/fresh-app.png" width="440"  alt="Fresh Main App">
<img src="./img/app-example.png" width="440"  alt="App Example">
<img src="./img/query-result.png" width="440"  alt="Query Result">
<img src="./img/webcamera.png" width="440"   alt="Webcamera">
</div>


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- SETUP -->
## Setup
### 1. Clone repository    
```bash
git clone https://github.com/NoHaitch/Algeo02-22063
``` 
### 2. Install dependencies   
```bash
npm install
``` 
### 3. Change the absolute Path  
&nbsp; &nbsp; In `src/server/texture.cpp` and `src/server/color.cpp`  
&nbsp; &nbsp; At main(), change the path to the uploads directory

### 4. Build the C++ server component (Require g++)
```bash
npm run build-server
``` 

### 5. Run the program    
```bash
npm run dev
# the program has only been tested at dev enviroment
``` 

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE -->
## Usage

at the root of the project   
`npm install` : install all the dependencies   
`npm run dev` : start the website  
`npm run dev-client` : run the client-side website  
`npm run dev-server` : run the server  
`npm run build` : build the program  
`npm run build-client` : build the client component (need cpp compiler)  
`npm run build-server` : build the server component (need cpp compiler)  

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- PROJECT STATUS -->
## Project Status
Project is: ___finished___

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Jika Anda ingin berkontribusi atau melanjutkan perkembangan program, silahkan fork repository ini dan gunakan branch fitur.  

Permintaan Pull __sangat diperbolehkan dan diterima dengan hangat__.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Special Thanks
- [Semantic Commit Messages](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716) 
- [Best-README-Template](https://github.com/othneildrew/Best-README-Template)

<!-- LICENSE -->
## License

The code in this project is licensed under MIT license.  
Code dalam projek ini berada di bawah lisensi MIT.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br>
<h3 align="center"> THANK YOU! </h3>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[issues-url]: https://github.com/NoHaitch/Tubes2_Algeo/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/NoHaitch/Tubes2_Algeo/blob/main/LICENSE
