import NavigationBarComponent from "../../components/Navigation.Bar.Component";
import { useState, useEffect } from "react";
import { FaDownload, FaHeart } from "react-icons/fa";
import axios from "axios";
import PhotoViewComponent from "../../components/Photo.View.Component";

interface Resource {
  id: string;
  resource_url: string;
  category: string;
  resource_admin: string;
  resource_title: string;
  resource_id: string;
  upload_date: string | number;
}

function All() {
  const [resources, setResources] = useState<Resource[]>([]);

  async function FetchResources() {
    try {
      const request = await axios.get("http://localhost:3500/resources", {
        headers: {
          Authorization: "",
        },
      });

      const response = await request.data;
      setResources(response);
    } catch (error) {
      console.warn(error);
    }
  }

  useEffect(() => {
    FetchResources();
  }, []);

  try {
    return (
      <>
        <NavigationBarComponent />
        <br />
        <section className="all">
          <h1>Beautiful photos in our gallery</h1>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cumque
            optio rem quidem fugiat voluptatum facere deleniti commodi! Debitis
            nesciunt eveniet eius voluptatem illo illum quam.
          </p>
          <br />
          <div className="photos">
            {resources.map((resource: Resource) => (
              <article
                className="photo_resource"
                key={resource.id}
                title={`${resource.resource_title} uploaded by ${resource.resource_admin}`}
              >
                <img
                  src={resource.resource_url}
                  alt={`photo from ${resource.category}`}
                  onClick={(event) => {
                    const photoView = document.querySelector(
                      ".photo-view"
                    ) as HTMLElement;
                    const imgPlaceholder = document.querySelector(
                      ".img-placeholder"
                    ) as HTMLImageElement;
                    const resourceAdmin = document.querySelector(
                      ".resource_admin"
                    ) as HTMLElement;
                    const uploadDate = document.querySelector(
                      ".upload_date"
                    ) as HTMLElement;
                    const resourceCollectionUl = document.querySelector(
                      ".resource_collection_ul"
                    ) as HTMLAnchorElement;

                    photoView.style.display = "flex";
                    imgPlaceholder.src = (event.target as HTMLImageElement).src;

                    const foundResource = resources.find(
                      (res: Resource) =>
                        res.resource_url ===
                        (event.target as HTMLImageElement).src
                    );

                    if (foundResource) {
                      resourceAdmin.textContent = foundResource.resource_admin;
                      uploadDate.textContent =
                        foundResource.upload_date.toString();
                      resourceCollectionUl.href = `/photos/categories/${foundResource.category}`;
                    }
                  }}
                />
                <div className="photo-details">
                  <section>
                    <aside>
                      <a href={resource.resource_url} download>
                        <button type="button">
                          <FaDownload />
                        </button>
                      </a>
                      <button type="button">
                        <FaHeart />
                      </button>
                    </aside>
                  </section>
                </div>
              </article>
            ))}
          </div>
          <PhotoViewComponent />
        </section>
      </>
    );
  } catch (error) {
    console.error(error);
  }
}

export default All;