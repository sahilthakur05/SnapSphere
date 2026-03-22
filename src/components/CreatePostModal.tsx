import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useAppDispatch } from "../app/hooks";
import { createPost } from "../features/post/postSlice";
import { ImagePlus, X } from "lucide-react";
import { ButtonSpinner } from "./Spinner";


interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePostModal({ isOpen, onClose }: Props) {
  const dispatch = useAppDispatch();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file,setFile]= useState<File |null>(null)
  const [caption ,setCaption]=useState('')
 const [isSubmitting, setIsSubmitting] = useState(false);

 const [fileError, setFileError] = useState<string | null>(null);

 const handleFileChange=(e:ChangeEvent<HTMLInputElement>)=>{
const selected= e.target.files?.[0]
if(!selected)return
setFileError(null);
if (selected.size > 5 * 1024 * 1024) {
  setFileError("Image must be under 5MB");
  return;
}
if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(selected.type)) {
  setFileError("Only JPEG, PNG, GIF, and WebP are allowed");
  return;
}
setFile(selected)
setPreview(URL.createObjectURL(selected))
 }

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  if (!file) return;

  setIsSubmitting(true);
  const formData = new FormData();
  formData.append("image", file);
  formData.append("caption", caption);

  await dispatch(createPost(formData));
  setIsSubmitting(false);
  setPreview(null);
  setFile(null);
  setCaption("");
  onClose();
};
if(!isOpen)return null
 return (
   <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
     <div className="w-full max-h-[90vh] overflow-y-auto rounded-t-xl sm:rounded-xl bg-white shadow-lg sm:max-w-lg">
       {/* Header */}
       <div className="flex items-center justify-between border-b px-4 py-3">
         <h2 className="text-lg font-semibold">Create Post</h2>
         <button
           onClick={onClose}
           className="text-gray-500 hover:text-gray-700"
         >
           <X className="h-5 w-5" />
         </button>
       </div>

       <form onSubmit={handleSubmit} className="p-4 space-y-4">
         {/* Image upload area */}
         {preview ? (
           <img
             src={preview}
             alt="Preview"
             className="w-full rounded-lg object-cover max-h-80"
           />
         ) : (
           <button
             type="button"
             onClick={() => fileRef.current?.click()}
             className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-12 text-gray-400 hover:border-brand-500 hover:text-brand-500"
           >
             <ImagePlus className="h-10 w-10" />
             <span className="text-sm">Click to upload an image</span>
           </button>
         )}
         <input
           ref={fileRef}
           type="file"
           accept="image/*"
           onChange={handleFileChange}
           className="hidden"
         />
         {fileError && (
           <p className="text-sm text-red-500">{fileError}</p>
         )}

         {/* Caption */}
         <textarea
           value={caption}
           onChange={(e) => setCaption(e.target.value)}
           placeholder="Write a caption…"
           rows={3}
           className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
         />

         {/* Submit */}
         <button
           type="submit"
           disabled={!file || isSubmitting}
           className="w-full rounded-lg bg-brand-500 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
         >
           {isSubmitting ? <ButtonSpinner /> : "Share Post"}
         </button>
       </form>
     </div>
   </div>
 );
}


