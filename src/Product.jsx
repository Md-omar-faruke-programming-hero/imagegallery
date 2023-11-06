import { useState } from "react";
import "./Product.css";
import { data } from "./data";
import { BiImage } from "react-icons/bi";
import { BiImageAdd } from "react-icons/bi";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableProduct from "./Component/SortableProduct";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Product = () => {
  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [products, setProducts] = useState(data);
  const [newImageSrc, setNewImageSrc] = useState("");

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  // drag and drop image function
  const onDragEnd = (event) => {
    const { active, over } = event;
    if (active.id === over.id) {
      return;
    }
    setProducts((products) => {
      const oldIndex = products.findIndex((product) => product.id === active.id);
      const newIndex = products.findIndex((product) => product.id === over.id);
      return arrayMove(products, oldIndex, newIndex);
    });
  };

  // select image function
  function toggleImageSelection(id) {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(id)) {
        return prevSelectedItems.filter((itemId) => itemId !== id);
      } else {
        return [...prevSelectedItems, id];
      }
    });
  }

  // delete selected image function
  function deleteSelectedImages() {
    const updatedItems = products.filter((item) => !selectedItems.includes(item.id));
    setProducts(updatedItems);
    toast.error("Delete your item successfully!");
    setSelectedItems([]);
  }

  // add new image function
  var expression = /^data:image\/(jpeg|jpg|gif|png|bmp|webp|svg\+xml|tiff|ico);base64,/;
  var regex = new RegExp(expression);
  const addNewImage = () => {
    if (newImageSrc) {
      if (newImageSrc.match(regex)) {
        console.log(34);
        const newImage = {
          id: Date.now().toString(), //  ID generation
          src: newImageSrc,
        };

        setProducts((prevProducts) => [...prevProducts, newImage]);
        toast.success("Image added successfully!");
        setNewImageSrc(""); // Clear the new image source after adding it
        onCloseModal();
      } else {
        toast.warning("invalid url");
      }
    } else {
      toast.warning("Past your image url");
    }
  };

  return (
    <main className="bg-[#f1f3f4] p-[10px] md:p-[20px] lg:p-[50px]">
      <ToastContainer />
      <section
        className={`products w-full md:w-[70%] ${
          products?.length <= 1 ? "h-screen" : "h-auto min-h-screen"
        } mx-auto rounded-[10px] md:rounded-[20px] lg:rounded-[30px] bg-[white]`}
      >
        {selectedItems?.length > 0 ? (
          <div className="flex flex-col md:flex-row justify-between px-[10px] md:px-[20px] py-[10px] md:py-[20px] border-b-[2px] md:border-b-[3px] border-solid border-[#f1f3f4]">
            <div className="mb-[10px] md:mb-0">
              <div className="flex items-center cursor-pointer">
                <input type="checkbox" checked="true" name="" id="" className="mr-[5px]" />
                <h1 className="font-semibold"> {selectedItems?.length} File Selected </h1>
              </div>
            </div>
            <div>
              <button onClick={deleteSelectedImages} className="text-[red] hover:underline">
                {selectedItems?.length > 1 ? "Delete files" : "Delete file"}
              </button>
            </div>
          </div>
        ) : (
          <div className="px-[10px] md:px-[20px]  py-[10px] md:py-[20px] border-b-[2px] md:border-b-[3px]border-solid border-[#f1f3f4]">
            <div className="cursor-pointer">
              <h1 className="font-semibold"> Gallery </h1>
            </div>
          </div>
        )}

        <div className="p-[10px] md:p-[20px]">
          <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={products} strategy={verticalListSortingStrategy}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-[10px]">
                {Array.isArray(products) &&
                  products?.length > 0 &&
                  products?.map((product, i) => (
                    <div
                      key={i}
                      className={`imgContainer  ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
                    >
                      {console.log(i, "index")}
                      <SortableProduct product={product} />
                      <>
                        {selectedItems.includes(product?.id) ? (
                          <div className="checkbox2">
                            <input
                              onChange={() => toggleImageSelection(product?.id)}
                              checked={selectedItems.includes(product?.id)}
                              type="checkbox"
                              name=""
                              id=""
                            />
                          </div>
                        ) : (
                          <div className="checkbox">
                            <input
                              onChange={() => toggleImageSelection(product?.id)}
                              checked={selectedItems.includes(product?.id)}
                              type="checkbox"
                              name=""
                              id=""
                            />
                          </div>
                        )}
                      </>
                    </div>
                  ))}

                <div
                  onClick={onOpenModal}
                  className="rounded border-[2px] border-dashed border-[#f1f3f4] p-[10px] md:p-[20px] flex justify-center items-center cursor-pointer"
                >
                  <div className="">
                    <BiImage className="mx-auto"></BiImage>
                    <p>Add image</p>
                  </div>
                </div>
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </section>

      <div>
        <Modal open={open} onClose={onCloseModal} center>
          <div className="py-[40px] bg-[orange] rounded-[55px]">
            <h2 className="my-[20px] text-center font-bold">Add new image</h2>
            <div className="flex flex-col px-[10px]">
              <input
                className="p-[5px]  border-0 my-[8px]"
                type="text"
                placeholder="Past Image URL "
                value={newImageSrc}
                onChange={(e) => setNewImageSrc(e.target.value)}
              />
              <button
                className="bg-amber-600 text-black p-[5px]  font-semibold"
                onClick={addNewImage}
              >
                Attach <BiImageAdd className="inline"></BiImageAdd>
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </main>
  );
};
export default Product;
