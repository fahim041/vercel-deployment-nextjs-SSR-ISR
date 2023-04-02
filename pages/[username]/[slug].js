import PostContent from "../../components/PostContent";
import { getUserWithUsername, firestore, postToJSON } from "../../lib/firebase";
import styles from "../../styles/Post.module.css";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { UserContext } from "../../lib/context";
import { useContext } from "react";
import Link from "next/link";
import AuthCheck from "../../components/AuthCheck";
import Heart from "../../components/HeartButton";

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = userDoc.ref.collection("posts").doc(slug);
    post = postToJSON(await postRef.get());
    path = postRef.path;
  }

  return {
    props: { post, path },
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  const snapshot = await firestore.collectionGroup("posts").get();

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
}

export default function Post(props) {
  const postRef = firestore.doc(props.path);
  const [realtimePost] = useDocumentData(postRef);
  const post = realtimePost || props.post;

  const { user: currentUser } = useContext(UserContext);
  return (
    <main className={styles.container}>
      <section>
        <PostContent post={post} />
      </section>
      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>

          <AuthCheck
            fallback={
              <Link href="/enter">
                <button>Sign Up</button>
              </Link>
            }
          >
            <Heart postRef={postRef} />
          </AuthCheck>

          {currentUser?.uid === post.uid && (
            <Link href={`/admin/${post.slug}`}>
              <button className="btn-blue">Edit Post</button>
            </Link>
          )}
        </p>
      </aside>
    </main>
  );
}
