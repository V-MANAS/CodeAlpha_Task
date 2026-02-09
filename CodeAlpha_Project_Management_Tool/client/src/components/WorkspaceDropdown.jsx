import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentWorkspace } from "../features/workspaceSlice";
import { useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";

function WorkspaceDropdown() {
  const { openCreateOrganization } = useClerk();

  const { workspaces, currentWorkspace } = useSelector(
    (state) => state.workspace
  );

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSelectWorkspace = (workspace) => {
    dispatch(setCurrentWorkspace(workspace));
    setIsOpen(false);
    navigate("/");
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative m-4" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((p) => !p)}
        className="w-full flex items-center justify-between p-3 rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
      >
        <div className="flex items-center gap-3">
          <img
            src={currentWorkspace?.image_url || "/placeholder.png"}
            alt={currentWorkspace?.name}
            className="w-8 h-8 rounded"
          />

          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">
              {currentWorkspace?.name || "Select Workspace"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {workspaces.length} workspace
              {workspaces.length !== 1 && "s"}
            </p>
          </div>
        </div>

        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-64 bg-white dark:bg-zinc-900 border rounded shadow-lg">
          <div className="p-2">
            <p className="text-xs uppercase tracking-wider px-2 mb-2">
              Workspaces
            </p>

            {workspaces.map((workspace) => (
              <div
                key={workspace.id}
                onClick={() => onSelectWorkspace(workspace)}
                className="flex items-center gap-3 p-2 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                <img
                  src={workspace.image_url || "/placeholder.png"}
                  className="w-6 h-6 rounded"
                />

                <p className="flex-1 truncate text-sm">
                  {workspace.name}
                </p>

                {currentWorkspace?.id === workspace.id && (
                  <Check className="w-4 h-4 text-blue-500" />
                )}
              </div>
            ))}
          </div>

          <hr />

          <div
            onClick={() => {
              openCreateOrganization();
              setIsOpen(false);
            }}
            className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <p className="flex items-center gap-2 text-xs text-blue-500">
              <Plus className="w-4 h-4" />
              Create Workspace
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkspaceDropdown;
