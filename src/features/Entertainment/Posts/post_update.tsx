import PostForm from '@/components/Entertainment/Post/post_form';
import { usePostDetailQuery } from '@/composable/Query/Entertainment/Posts/usePostDetailQuery';
import { useParams } from 'react-router-dom'

export default function PostUpdate() {
    const {id} = useParams();
    const {postDetail, isDetailPending} = usePostDetailQuery(Number(id));
    if(isDetailPending){
        <div>Loading...</div>
    }
    if(!postDetail) return null;
  return (
    <div>
        <PostForm
        key={postDetail.id}
        mode='edit'
        defaultValues={{
            id:id,
            description: postDetail?.description ?? "",
            visibility: postDetail?.visibility ?? "",
            isVideo: postDetail?.media?.some((m: any) => m.type === "video") ?? false,
            media:postDetail.media
            // postDetail?.media?.map((m: any) => ({
            //   id: crypto.randomUUID(),
            //   url: m.url,
            //   alt: m.alt ?? "",
            //   type: m.type,
            // })) ?? [],
        }}
        />
    </div>
  )
}
