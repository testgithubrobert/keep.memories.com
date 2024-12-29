import NavigationBarComponent from "../components/Navigation.Bar.Component";
import FooterComponent from "../components/Footer.Component";
import { useState } from "react";
import axios from "axios";
import { FaDownload } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import PhotoViewComponent from "../components/Photo.View.Component";

interface Resource {
  id: string;
  resource_url: string;
  category: string;
  resource_admin: string;
  resource_title: string;
  resource_id: string;
  upload_date: string | number;
}

function FilterBar() {
  const [searches, setSearches] = useState([] as Resource[]);

  return (
    <>
      <NavigationBarComponent />
      <section className={String("filter-bar")}>
        <div className="filter-bar-input-wrapper">
          <input
            type="search"
            name=""
            id="filter-bar-input"
            onInput={async (event) => {
              event.stopPropagation();
              const request = await axios.get(
                "http://localhost:3500/resources",
                {
                  headers: {
                    Authorization: "",
                  },
                }
              );

              const response = await request.data;
              console.log(searches.length);

              if ((event.target as HTMLInputElement).value === "") {
                setSearches([]);
              } else {
                setSearches(
                  response.filter((index: Resource) => {
                    return index.resource_title.includes(
                      (event.target as HTMLInputElement).value
                    );
                  })
                );
              }
            }}
          />
          <button
            type="button"
            onClick={async (event) => {
              event.stopPropagation();
              const request = await axios.get(
                "http://localhost:3500/resources",
                {
                  headers: {
                    Authorization: "",
                  },
                }
              );

              const response = await request.data;

              if (
                (
                  window.document.querySelector(
                    "#filter-bar-input"
                  ) as HTMLInputElement
                ).value === ""
              ) {
                setSearches([]);
              } else {
                setSearches(
                  response.filter((index: Resource) => {
                    return index.resource_title.includes(
                      (
                        window.document.querySelector(
                          "#filter-bar-input"
                        ) as HTMLInputElement
                      ).value
                    );
                  })
                );
              }
            }}
          >
            search
          </button>
        </div>
        <h1>Beautiful photos from your searches</h1>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cumque optio
          rem quidem fugiat voluptatum facere deleniti commodi! Debitis nesciunt
          eveniet eius voluptatem illo illum quam.
        </p>
        <br />
        <article>
          {searches.length > 0 ? (
            searches.map((result: Resource) => (
              <article
                className={String("photo_resource")}
                key={result.id}
                title={`Photo uploaded by ${result.resource_admin}`}
              >
                <img
                  src={result.resource_url}
                  alt={`photo from ${result.category}`}
                  onClick={() => {
                    (
                      window.document.querySelector(
                        ".photo-view"
                      ) as HTMLElement
                    ).style.display = "flex";
                  }}
                />
                <div className={String("photo-details")}>
                  <section>
                    {/* <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sequi, dolores asperiores? Sed consectetur esse tempore animi facilis perspiciatis, nesciunt laboriosam.</p> */}
                    <aside>
                      <a href="" download={String(result.resource_url)}>
                        <button type="button" className={String("")}>
                          <FaDownload />
                        </button>
                      </a>
                      <button type="button" className={String("")}>
                        <FaHeart />
                      </button>
                    </aside>
                  </section>
                </div>
              </article>
            ))
          ) : (
            <div className="warning-results-message">
              <img src="/search_webp.jpg" alt="photo" className="search_webp" />
              {/* <p className="search-results-message">There are no search results!</p> */}
            </div>
          )}
          <PhotoViewComponent />
        </article>
      </section>
      <FooterComponent />
    </>
  );
}

export default FilterBar;