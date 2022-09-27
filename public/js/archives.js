document.addEventListener("DOMContentLoaded", () => {
  const archiveList_el = document.querySelector(".archive-list");
  archiveList_el.addEventListener("click", (e) => {
    if (e.target.className.includes("deletePost")) {
      const id = e.target.dataset.id;
      const title = e.target.dataset.title;
      
      if (confirm(`確認是否刪除 ${title}`)) {
        axios({
          method: "post",
          url: `/dashboard/archives/delete/${id}`,
          "Content-Type": "application/json",
        }).then((res) => {
          window.location = "/dashboard/archives";
        });
      }
    }
  });
});
