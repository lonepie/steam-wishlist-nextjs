import React from 'react';
import moment from "moment";

function WishlistItem(props) {
    return <div className="w-full lg:w-1/6">
        <div className="card bg-gray-900 shadow-xl m-2 rounded">
            <figure className="w-full flex flex-center">
                <img src={props.item.capsule} alt="Inventory Image" className="max-w-[200px]"/></figure>
            <div className="card-body">
                <h2 className="card-title text-base flex flex-start h-36 text-ellipsis overflow-hidden items-start text-white">
                    {props.item.name}
                </h2>
                <div className="card-actions justify-between text-gray-400 flex items-center">
                    <div className="text-sm text-gray-400">{moment(props.item.added * 1000).format("MMMM Do YYYY")}</div>
                    <div className="badge badge-outline p-4 uppercase">{props.item.reviews_percent}</div>
                </div>
            </div>
        </div>
    </div>;
}

export default WishlistItem;

