// import { useEffect } from "react";
// import handleApi from "../../../admin/src/api/handler/apiHanlder";

// function useDynamicTags() {
//       useEffect(() => {
//             const fetchTags = async () => {
//                   const { data: tags } = await handleApi("tags", "GET");
//                   const activeTags = tags.filter(
//                         (tag) => tag.status === "active"
//                   );

//                   activeTags.forEach((tag) => {
//                         const target = document.querySelector(tag.location);
//                         if (!target) {
//                               console.warn(
//                                     `Target not found for selector: ${tag.location}`
//                               );
//                               return;
//                         }

//                         // Create a temporary container to convert the string into a DOM node
//                         const tempContainer = document.createElement("div");
//                         tempContainer.innerHTML = tag.script;
//                         const scriptNode = tempContainer.firstChild;

//                         // Append the created script element node to the target
//                         if (scriptNode) {
//                               target.appendChild(scriptNode);
//                         } else {
//                               console.warn(
//                                     "Failed to parse script from string:",
//                                     tag.script
//                               );
//                         }
//                   });
//             };

//             fetchTags();
//       }, []);

//       return null;
// }

// export default useDynamicTags;
