import { useState } from "react";
import "./Product.css";
import { data } from "./data";
import { BiImage } from "react-icons/bi";
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableProduct = ({ product, selectedItems, toggleImageSelection }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: product.id,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={` rounded-[5px] md:rounded-[8px] overflow-hidden border-[2px] border-solid border-[#f1f3f4] hover:overlay-bg cursor-move `}
    >
      <img className="" src={product.src} alt="" />
    </div>
  );
};

const Product = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [products, setProducts] = useState(data);

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
    setSelectedItems([]);
  }

  return (
    <div className="bg-[#f1f3f4] p-[10px] md:p-[20px] lg:p-[50px]">
      <div className="products w-full md:w-[70%] mx-auto rounded-[10px] md:rounded-[20px] lg:rounded-[30px] bg-[white]">
        {selectedItems.length > 0 ? (
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
                {products.map((product, i) => (
                  <div
                    key={i}
                    className={`imgContainer  ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
                  >
                    <SortableProduct
                      i={i}
                      product={product}
                      selectedItems={selectedItems}
                      toggleImageSelection={toggleImageSelection}
                    />
                    <>
                      {selectedItems.includes(product.id) ? (
                        <div className="checkbox2">
                          <input
                            onChange={() => toggleImageSelection(product.id)}
                            checked={selectedItems.includes(product.id)}
                            type="checkbox"
                            name=""
                            id=""
                          />
                        </div>
                      ) : (
                        <div className="checkbox">
                          <input
                            onChange={() => toggleImageSelection(product.id)}
                            checked={selectedItems.includes(product.id)}
                            type="checkbox"
                            name=""
                            id=""
                          />
                        </div>
                      )}
                    </>
                  </div>
                ))}

                <div className="rounded border-[2px] border-dashed border-[#f1f3f4] p-[10px] md:p-[20px] flex justify-center items-center cursor-pointer">
                  <div className="">
                    <BiImage className="mx-auto"></BiImage>
                    <p>Add image</p>
                  </div>
                </div>
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
};
export default Product;