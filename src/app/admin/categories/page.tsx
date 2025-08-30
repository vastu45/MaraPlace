"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import Toast from "@/components/Toast";
import AdminLayout from "@/components/AdminLayout";

interface Subcategory {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  subcategories: Subcategory[];
}

export default function AdminCategories() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<string | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSubcategory, setShowAddSubcategory] = useState<string | null>(null);
  
  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  });
  
  const [subcategoryForm, setSubcategoryForm] = useState({
    name: "",
    description: "",
    categoryId: "",
  });
  
  const [existingSubcategories, setExistingSubcategories] = useState<string[]>([]);
  const [showNewSubcategoryForm, setShowNewSubcategoryForm] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
    isVisible: false,
  });

  // Check if user is admin
  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || (session.user as any)?.role !== "ADMIN") {
      router.push("/login");
    }
  }, [session, status, router]);

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({
      message,
      type,
      isVisible: true,
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
        
        // Extract all existing subcategory names
        const allSubcategoryNames = data.categories?.flatMap((cat: Category) => 
          cat.subcategories.map((sub: Subcategory) => sub.name)
        ) || [];
        setExistingSubcategories(allSubcategoryNames);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryForm),
      });

      if (res.ok) {
        setCategoryForm({ name: "", description: "" });
        setShowAddCategory(false);
        fetchCategories();
        showToast("Category added successfully!", "success");
      } else {
        const errorData = await res.json();
        showToast(errorData.error || "Failed to add category", "error");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      showToast("Failed to add category", "error");
    }
  };

  const handleUpdateCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryForm),
      });

      if (res.ok) {
        setEditingCategory(null);
        setCategoryForm({ name: "", description: "" });
        fetchCategories();
        showToast("Category updated successfully!", "success");
      } else {
        const errorData = await res.json();
        showToast(errorData.error || "Failed to update category", "error");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      showToast("Failed to update category", "error");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchCategories();
        showToast("Category deleted successfully!", "success");
      } else {
        const errorData = await res.json();
        showToast(errorData.error || "Failed to delete category", "error");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      showToast("Failed to delete category", "error");
    }
  };

  const handleAddExistingSubcategory = async (subcategoryName: string) => {
    try {
      // Find the existing subcategory to get its description
      const existingSubcategory = categories
        .flatMap(cat => cat.subcategories)
        .find(sub => sub.name === subcategoryName);
      
      const res = await fetch("/api/admin/subcategories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: subcategoryName,
          description: existingSubcategory?.description || "",
          categoryId: subcategoryForm.categoryId,
        }),
      });

      if (res.ok) {
        setSubcategoryForm({ name: "", description: "", categoryId: "" });
        setShowAddSubcategory(null);
        setShowNewSubcategoryForm(false);
        fetchCategories();
        showToast("Subcategory added successfully!", "success");
      } else {
        const errorData = await res.json();
        showToast(errorData.error || "Failed to add subcategory", "error");
      }
    } catch (error) {
      console.error("Error adding existing subcategory:", error);
      showToast("Failed to add subcategory", "error");
    }
  };

  const handleAddSubcategory = async () => {
    try {
      const res = await fetch("/api/admin/subcategories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subcategoryForm),
      });

      if (res.ok) {
        setSubcategoryForm({ name: "", description: "", categoryId: "" });
        setShowAddSubcategory(null);
        setShowNewSubcategoryForm(false);
        fetchCategories();
        showToast("Subcategory created successfully!", "success");
      } else {
        const errorData = await res.json();
        showToast(errorData.error || "Failed to add subcategory", "error");
      }
    } catch (error) {
      console.error("Error adding subcategory:", error);
      showToast("Failed to add subcategory", "error");
    }
  };

  const handleUpdateSubcategory = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/subcategories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subcategoryForm),
      });

      if (res.ok) {
        setEditingSubcategory(null);
        setSubcategoryForm({ name: "", description: "", categoryId: "" });
        fetchCategories();
        showToast("Subcategory updated successfully!", "success");
      } else {
        const errorData = await res.json();
        showToast(errorData.error || "Failed to update subcategory", "error");
      }
    } catch (error) {
      console.error("Error updating subcategory:", error);
      showToast("Failed to update subcategory", "error");
    }
  };

  const handleDeleteSubcategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subcategory?")) return;

    try {
      const res = await fetch(`/api/admin/subcategories/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchCategories();
        showToast("Subcategory deleted successfully!", "success");
      } else {
        const errorData = await res.json();
        showToast(errorData.error || "Failed to delete subcategory", "error");
      }
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      showToast("Failed to delete subcategory", "error");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
            <button
              onClick={() => setShowAddCategory(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>

          {/* Add Category Modal */}
          {showAddCategory && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Add New Category</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter category name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter description"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddCategory}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Add Category
                    </button>
                    <button
                      onClick={() => setShowAddCategory(false)}
                      className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Categories List */}
          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    {editingCategory === category.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                          className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button
                          onClick={() => handleUpdateCategory(category.id)}
                          className="p-1 text-green-600 hover:text-green-800"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingCategory(null);
                            setCategoryForm({ name: "", description: "" });
                          }}
                          className="p-1 text-gray-600 hover:text-gray-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    )}
                    {category.description && (
                      <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingCategory(category.id);
                        setCategoryForm({ name: category.name, description: category.description || "" });
                      }}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                                         <button
                       onClick={() => {
                         setShowAddSubcategory(category.id);
                         setSubcategoryForm({ ...subcategoryForm, categoryId: category.id });
                         setShowNewSubcategoryForm(false);
                       }}
                       className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                     >
                       Add Subcategory
                     </button>
                  </div>
                </div>

                {/* Subcategories */}
                <div className="ml-6 space-y-2">
                  {category.subcategories.map((subcategory) => (
                    <div key={subcategory.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex-1">
                        {editingSubcategory === subcategory.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={subcategoryForm.name}
                              onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value })}
                              className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <button
                              onClick={() => handleUpdateSubcategory(subcategory.id)}
                              className="p-1 text-green-600 hover:text-green-800"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingSubcategory(null);
                                setSubcategoryForm({ name: "", description: "", categoryId: "" });
                              }}
                              className="p-1 text-gray-600 hover:text-gray-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm font-medium text-gray-700">{subcategory.name}</span>
                        )}
                        {subcategory.description && (
                          <p className="text-xs text-gray-500 mt-1">{subcategory.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingSubcategory(subcategory.id);
                            setSubcategoryForm({
                              name: subcategory.name,
                              description: subcategory.description || "",
                              categoryId: category.id,
                            });
                          }}
                          className="p-1 text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteSubcategory(subcategory.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                                 {/* Add Subcategory Modal */}
                 {showAddSubcategory === category.id && (
                   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                     <div className="bg-white rounded-lg p-6 w-full max-w-md">
                       <h2 className="text-xl font-bold mb-4">Add Subcategory to {category.name}</h2>
                       
                       {!showNewSubcategoryForm ? (
                         <div className="space-y-4">
                           <div>
                             <label className="block text-sm font-medium text-gray-700 mb-2">
                               Select Existing Subcategory
                             </label>
                             <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg">
                               {(() => {
                                 const currentCategorySubcategories = category.subcategories.map(sub => sub.name);
                                 const availableSubcategories = existingSubcategories.filter(
                                   subName => !currentCategorySubcategories.includes(subName)
                                 );
                                 
                                 return availableSubcategories.length > 0 ? (
                                   availableSubcategories.map((subcategoryName) => (
                                     <button
                                       key={subcategoryName}
                                       onClick={() => handleAddExistingSubcategory(subcategoryName)}
                                       className="w-full px-3 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                                     >
                                       {subcategoryName}
                                     </button>
                                   ))
                                 ) : (
                                   <div className="px-3 py-2 text-gray-500 text-sm">
                                     No available subcategories to add
                                   </div>
                                 );
                               })()}
                             </div>
                           </div>
                           
                           <div className="border-t pt-4">
                             <p className="text-sm text-gray-600 mb-3">
                               Or create a new subcategory:
                             </p>
                             <button
                               onClick={() => setShowNewSubcategoryForm(true)}
                               className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                             >
                               Create New Subcategory
                             </button>
                           </div>
                           
                           <button
                             onClick={() => setShowAddSubcategory(null)}
                             className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                           >
                             Cancel
                           </button>
                         </div>
                       ) : (
                         <div className="space-y-4">
                           <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">
                               New Subcategory Name
                             </label>
                             <input
                               type="text"
                               value={subcategoryForm.name}
                               onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value })}
                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                               placeholder="Enter new subcategory name"
                             />
                           </div>
                           <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">
                               Description
                             </label>
                             <textarea
                               value={subcategoryForm.description}
                               onChange={(e) => setSubcategoryForm({ ...subcategoryForm, description: e.target.value })}
                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                               placeholder="Enter description"
                               rows={3}
                             />
                           </div>
                           <div className="flex gap-2">
                             <button
                               onClick={handleAddSubcategory}
                               className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                             >
                               Create Subcategory
                             </button>
                             <button
                               onClick={() => setShowNewSubcategoryForm(false)}
                               className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                             >
                               Back
                             </button>
                           </div>
                         </div>
                       )}
                     </div>
                   </div>
                 )}
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </AdminLayout>
  );
}
