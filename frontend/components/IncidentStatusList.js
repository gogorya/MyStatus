// Library
import { formatDate } from "@/lib/utils";

export default function Page({ props }) {
  return (
    <div className="space-y-2">
      {props.statusHistory.map((status, index) => {
        return (
          <div key={status._id} className="flex flex-row">
            <div className="w-7 flex flex-col justify-center">
              <div className="flex justify-center">
                <div className="mt-2 h-2 w-2 rounded-md bg-black dark:bg-white"></div>
              </div>
              <div className="flex flex-1 justify-center">
                {index != props.statusHistory.length - 1 && (
                  <div className="mt-2 w-[1px] h-full bg-gray-300 dark:bg-gray-700"></div>
                )}
              </div>
            </div>

            <div className="ml-2 flex-1 text-sm">
              <div className=" flex justify-between items-center">
                <span>{status.status}</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {formatDate(status.createdAt)}
                </span>
              </div>

              <div>
                <span className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {status.message}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
