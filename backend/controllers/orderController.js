const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

const createOrder = async (req, res, next) => {
  try {
    const { items, tableNumber, paymentStatus } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400);
      throw new Error('Sipariş ürünleri zorunlu');
    }

    if (!tableNumber) {
      res.status(400);
      throw new Error('Masa numarası zorunlu');
    }

    if (paymentStatus !== 'paid') {
      res.status(400);
      throw new Error('Sipariş ancak ödeme yapıldıktan sonra oluşturulabilir');
    }

    const builtItems = [];
    let totalPrice = 0;

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);

      if (!menuItem) {
        res.status(404);
        throw new Error('Siparişteki ürünlerden biri bulunamadı');
      }

      if (!menuItem.isAvailable) {
        res.status(400);
        throw new Error(`${menuItem.name} şu anda müsait değil`);
      }

      const quantity = Number(item.quantity) || 1;
      const itemTotal = menuItem.price * quantity;
      totalPrice += itemTotal;

      builtItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        quantity,
        price: menuItem.price,
      });
    }

    const order = await Order.create({
      customer: req.user._id,
      items: builtItems,
      tableNumber,
      totalPrice,
      paymentStatus: 'paid',
      orderStatus: 'received',
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email role')
      .populate('items.menuItem', 'name category price');

    res.status(201).json({
      message: 'Sipariş başarıyla oluşturuldu',
      order: populatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const { status, sort, tableNumber } = req.query;

    const filter = {
      customer: req.user._id,
    };

    if (status) {
      filter.orderStatus = status;
    }

    if (tableNumber) {
      filter.tableNumber = Number(tableNumber);
    }

    let sortOption = { createdAt: -1 };

    if (sort === 'newest') sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'price_asc') sortOption = { totalPrice: 1 };
    if (sort === 'price_desc') sortOption = { totalPrice: -1 };
    if (sort === 'table_asc') sortOption = { tableNumber: 1 };
    if (sort === 'table_desc') sortOption = { tableNumber: -1 };

    const orders = await Order.find(filter)
      .populate('customer', 'name email role')
      .populate('items.menuItem', 'name category price')
      .sort(sortOption);

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const { status, paymentStatus, sort, tableNumber } = req.query;

    const filter = {};

    if (status) {
      filter.orderStatus = status;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    if (tableNumber) {
      filter.tableNumber = Number(tableNumber);
    }

    let sortOption = { createdAt: -1 };

    if (sort === 'newest') sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'price_asc') sortOption = { totalPrice: 1 };
    if (sort === 'price_desc') sortOption = { totalPrice: -1 };
    if (sort === 'table_asc') sortOption = { tableNumber: 1 };
    if (sort === 'table_desc') sortOption = { tableNumber: -1 };

    const orders = await Order.find(filter)
      .populate('customer', 'name email role')
      .populate('items.menuItem', 'name category price')
      .sort(sortOption);

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;

    const validStatuses = ['received', 'preparing', 'ready', 'delivered'];

    if (!validStatuses.includes(orderStatus)) {
      res.status(400);
      throw new Error('Geçersiz sipariş durumu');
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Sipariş bulunamadı');
    }

    order.orderStatus = orderStatus;
    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email role')
      .populate('items.menuItem', 'name category price');

    res.status(200).json({
      message: 'Sipariş durumu güncellendi',
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};