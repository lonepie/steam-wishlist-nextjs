import {Inter} from 'next/font/google'
import Screen from "@/components/screen"
import {useEffect, useState} from "react";
import { useRouter } from 'next/router';
import moment from "moment";
// import InventoryItem from "@/components/inventoryItem";
import {ArrowLeftIcon} from "@heroicons/react/24/solid";
import Link from "next/link";
import Head from "next/head";
import WishlistItem from '@/components/wishListItem';

const inter = Inter({subsets: ['latin']})

export default function Wishlist({ profile, wishList }) {
  const router = useRouter();
  const [error, setError] = useState("");

  return (
        <main className={`flex min-h-screen flex-col items-center ${inter.className}">`}>
            <Screen>
                <Head>
                    <title>Steam Wishlist for {profile.personaname}</title>
                    <meta name="description" content="Steam Wishlist for {profile.personaname}"/>
                </Head>
                <div className="flex flex-col items-start justify-center w-full bg-gray-800"></div>
                    <div className="flex flex-col w-full px-10 pt-10 pb-8 gap-4 justify-start">
                        <div className="flex flex-col lg:flex-row  items-center gap-2 lg:gap-10 text-gray-700">
                            <Link
                                className="btn btn-primary bg-gray-700 border-gray-600 flex flex-row gap-1  rounded w-48"
                                href="/">
                                <ArrowLeftIcon className="w-6 h-6"/>
                                BACK
                            </Link>
                            <span>
                                {profile.profileurl}
                            </span>
                            <span>
                                {profile.steamid}
                            </span>
                        </div>
                        <div className="flex flex-row gap-2">
                            <img src={profile.avatarfull} alt="Profile Logo" className="rounded w-48 h-48"/>
                            <div className="profile-name flex justify-center items-start flex-col gap-2 ml-4">
                                <h1 className="text-2xl font-bold text-white w-full">
                                    Inventory from <a href={profile.profileurl} target="_blank"
                                       className="underline inline">{profile.personaname}</a>
                                </h1>
                                {profile.personastateflags === 1 && (
                                    <span
                                        className="flag country flex gap-4 items-center justify-start text-white text-xl">
                                <img
                                    src={`https://flagsapi.com/${profile.loccountrycode}/flat/32.png`}/> {profile.loccountrycode}
                            </span>
                                )}
                                <span className="createdAt text-gray-500 text-base moment-js">
                                Since: {moment(profile.timecreated * 1000).fromNow()}
                            </span>
                                <span className="online-or-offline text-gray-500 text-base">
                                {profile.personastate === 0 ? 'Offline' : 'Online'}
                            </span>
                                <span className="total-worth text-xl text-white font-bold">
                                Total Items: {wishList.length}
                            </span>
                            </div>
                        </div>
                    </div>
                    {error !== "" ?
                        <div
                            className="text-red-400 text-3xl font-bold flex justify-center mt-40 w-full">{error}</div> :
                        <div className="bg-gray-800 w-full mb-40">
                          { wishList && wishList.length > 0 ? (
                              <div className="flex flex-col flex-wrap px-8 justify-start lg:flex-row">
                                {wishList.map((item) => (
                                  <WishlistItem key={item.id} item={item} />
                                ))}
                              </div>
                          ) : (
                              <div className="flex flex-row flex-wrap gap-4 p-10 justify-center">
                                <h1 className="text-3xl font-bold text-white w-full text-center">
                                    No items found
                                </h1>
                              </div>
                          )}
                        </div>}
            </Screen>
        </main>
  )
}

export const getServerSideProps = async (context) => {
    const {steamId} = context.params;

    // const wishListResponse = await fetch(`http://localhost:3000/api/steam?type=wishlist&steamid=${steamId}`);
    // const wishListResponse = await fetch(`https://store.steampowered.com/wishlist/profiles/${steamId}/wishlistdata/`)
    // const wishListData = await wishListResponse.json();

    // let wishList = Object.entries(wishListData).map(([k, v]) => { 
    //   return { id: k, ...v };
    //  });
    let wishList = [];
    
    // if (wishList.length > 90) {
      for (let i = 0; i < 10; i++) {
        // let wishListPageResponse = await fetch(`http://localhost:3000/api/steam?type=wishlist&page=${i}&steamid=${steamId}`);
        let wishListPageResponse = await fetch(`https://store.steampowered.com/wishlist/profiles/${steamId}/wishlistdata/?p=${i}`);
        let wishListPage = Object.entries(await wishListPageResponse.json());
        if (wishListPage.length) {
          wishList.push(...wishListPage.map(([k, v]) => {
            return { id: k, ...v };
          }));
        }
        else
          break;
      }
    // }
    wishList.sort((a, b) => {
      if (a.added < b.added)
        return 1;
      if (a.added > b.added)
        return -1;
        
      return 0;
    });
    console.log(wishList.length);

    const profileApi = `${process.env.BASE_API_URL}profile?key=${process.env.BASE_API_KEY}&steam_id=${steamId}`;
    const profileResponse = await fetch(profileApi);
    const profileStatus = profileResponse.status;
    const profile = await profileResponse.json();

    if (profileStatus !== 200) {
        // send 404 page
        return {
            notFound: true,
        }
    }
    return {
      props: { profile, wishList },
    }
}