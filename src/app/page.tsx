import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  ArrowUpRight,
  Filter,
  Download
} from "lucide-react";
import StatCard from "@/components/StatCard";
import OrderTable from "@/components/OrderTable";

export default function Home() {
  return (
    <div className="animate-fade-in">
      <header style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "2.5rem" 
      }}>
        <div>
          <h1 style={{ margin: 0 }}>داشبورد</h1>
          <p>خوش آمدید! خلاصه وضعیت امروز را مشاهده کنید.</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button className="btn btn-secondary">
            <Filter size={18} />
            فیلترها
          </button>
          <button className="btn btn-primary">
            <Download size={18} />
            خروجی گزارش
          </button>
        </div>
      </header>

      <section className="grid grid-cols-4" style={{ marginBottom: "2.5rem" }}>
        <StatCard 
          title="درآمد کل" 
          value="۱۲۴,۵۹۲,۰۰۰ تومان" 
          change="۱۲.۵٪" 
          isPositive={true} 
          icon={<DollarSign size={24} />} 
        />
        <StatCard 
          title="تعداد سفارشات" 
          value="۴۵,۲۳۱" 
          change="۸.۲٪" 
          isPositive={true} 
          icon={<ShoppingCart size={24} />} 
        />
        <StatCard 
          title="کاربران فعال" 
          value="۱۲,۸۴۲" 
          change="۳.۱٪" 
          isPositive={false} 
          icon={<Users size={24} />} 
        />
        <StatCard 
          title="نرخ تبدیل" 
          value="۳.۲۴٪" 
          change="۴.۵٪" 
          isPositive={true} 
          icon={<ArrowUpRight size={24} />} 
        />
      </section>

      <section>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "1.5rem" 
        }}>
          <h2 style={{ margin: 0 }}>سفارشات اخیر</h2>
          <button style={{ 
            background: "transparent", 
            border: "none", 
            color: "var(--primary)",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem"
          }}>
            مشاهده همه
            <ArrowUpRight size={16} />
          </button>
        </div>
        <OrderTable />
      </section>
    </div>
  );
}
