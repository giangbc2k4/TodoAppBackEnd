import Task from "../models/Task.js";

export const getAlltask = async (req, res) => {
  try {
    const user = req.user;
    const tasks = await Task.find({ user: user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Lấy danh sách task thành công",
      totalTasks: tasks.length,
      tasks,
    });
  } catch (error) {
    console.log("Lỗi getAlltask:", error);
    return res.status(500).json({ message: "Lỗi server", error });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Thiếu title" });
    }
    await Task.create({
      title,
      description,
      dueDate,
      user: req.user._id,
    });
    return res.status(201).json({ message: "Tao task thanh cong" });
  } catch (error) {
    console.log("loi createTak");
    return res.status(500).json({ message: "Loix createTak", error });
  }
};

export const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user._id;

    // Tìm và update task thuộc đúng user
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, user: userId }, // đảm bảo không sửa task của người khác
      req.body,
      { new: true } // trả về object đã update
    );

    if (!updatedTask) {
      return res
        .status(404)
        .json({ message: "Task không tồn tại hoặc không thuộc user này" });
    }

    return res.status(200).json({
      message: "Cập nhật task thành công",
      task: updatedTask,
    });
  } catch (error) {
    console.log("Lỗi updateTask:", error);
    return res.status(500).json({ message: "Lỗi server", error });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user._id;

    // Chỉ xoá task thuộc user này
    const deletedTask = await Task.findOneAndDelete({
      _id: taskId,
      user: userId,
    });

    if (!deletedTask) {
      return res
        .status(404)
        .json({ message: "Task không tồn tại hoặc không thuộc user này" });
    }

    return res.status(200).json({ message: "Xoá task thành công" });
  } catch (error) {
    console.log("Lỗi deleteTask:", error);
    return res.status(500).json({ message: "Lỗi server", error });
  }
};

export const getFilteredTasks = async (req, res) => {
  try {
    const { completed } = req.query;
    const userId = req.user._id;

    // Tạo filter cơ bản: task thuộc user
    const filter = { user: userId };

    // Lọc completed
    if (completed === "true") filter.completed = true;
    if (completed === "false") filter.completed = false;

    // Lấy task từ database
    const tasks = await Task.find(filter).sort({ dueDate: 1 });

    return res.status(200).json({
      completed: completed || null,
      total: tasks.length,
      tasks,
    });
  } catch (error) {
    console.log("Lỗi getFilteredTasks:", error);
    return res.status(500).json({
      message: "Lỗi server khi lọc task",
      error,
    });
  }
};

export const searchTask = async (req, res) => {
  try {
    const { q } = req.query; // từ khoá tìm kiếm
    const userId = req.user._id; // user đang login

    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Thiếu từ khoá tìm kiếm" });
    }

    // Tạo regex tìm gần đúng, không phân biệt hoa/thường
    const keyword = new RegExp(q, "i");

    // Tìm theo title HOẶC description
    const tasks = await Task.find({
      user: userId,
      $or: [{ title: keyword }, { description: keyword }],
    }).sort({ createdAt: -1 }); // sort từ mới nhất xuống

    return res.status(200).json({
      keyword: q,
      total: tasks.length,
      tasks,
    });
  } catch (error) {
    console.log("Lỗi searchTask:", error);
    return res.status(500).json({ message: "Lỗi server", error });
  }
};
