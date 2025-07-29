import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { ArrowRight, Bot, Sun, Zap, Send, Linkedin, ChevronDown, MessageSquare, TrendingUp, Leaf, Moon, DollarSign, TreePine, Facebook, Instagram, CloudRain, Award } from 'lucide-react';
import { getDashboardData, getWeatherForecast, submitContactForm, getAIChatResponse } from './services/api';

// --- UTILITY FUNCTIONS ---
const monthMap = { jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3, apr: 4, april: 4, may: 5, jun: 6, june: 6, jul: 7, july: 7, aug: 8, august: 8, sep: 9, september: 9, oct: 10, october: 10, nov: 11, november: 11, dec: 12, december: 12 };

// --- UI COMPONENTS ---
const Card = ({ children, className = '' }) => (<div className={`bg-white dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-lg p-6 transition-colors duration-300 ${className}`}>{children}</div>);
const CardHeader = ({ children, className = '' }) => <div className={`mb-4 ${className}`}>{children}</div>;
const CardTitle = ({ children, className = '' }) => <h3 className={`text-lg font-semibold text-gray-900 dark:text-white ${className}`}>{children}</h3>;
const CardDescription = ({ children, className = '' }) => <p className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>{children}</p>;
const CardContent = ({ children, className = '' }) => <div className={className}>{children}</div>;
const Button = ({ children, className = '', variant = 'default', size = 'default', ...props }) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black disabled:opacity-50 disabled:pointer-events-none";
    const sizeClasses = { default: "h-10 py-2 px-4", sm: "h-9 px-3 rounded-md", lg: "h-11 px-8 rounded-md", icon: "h-10 w-10" };
    const variantClasses = {
        default: "bg-yellow-400 text-black hover:bg-yellow-500/90",
        outline: "border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-100 hover:text-black dark:hover:bg-gray-800 dark:text-white",
        ghost: "hover:bg-gray-100 dark:hover:bg-gray-800"
    };
    return <button className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`} {...props}>{children}</button>;
};
const Input = ({ className = '', ...props }) => (<input className={`flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 dark:focus:ring-offset-gray-950 ${className}`} {...props} />);
const Select = ({ children, className = '', ...props }) => (<select className={`h-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 dark:focus:ring-offset-gray-950 ${className}`} {...props}>{children}</select>);

// --- PAGE SECTIONS ---
const Header = ({ darkMode, setDarkMode }) => (<header className="fixed top-0 left-0 right-0 z-40 bg-black/30 backdrop-blur-sm"><div className="container mx-auto px-4 h-16 flex items-center justify-between"><div className="flex items-center space-x-2"><Sun className="w-6 h-6 text-yellow-400" /><span className="text-white font-bold text-lg">Rooftop Energy</span></div><Button onClick={() => setDarkMode(!darkMode)} variant="ghost" size="icon" className="text-white hover:text-yellow-400"><Moon className="w-5 h-5" /></Button></div></header>);
const HeroSection = () => (<section className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden bg-black"><div className="absolute inset-0 z-0"><div className="absolute inset-0 opacity-20"><div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400 rounded-full mix-blend-screen filter blur-3xl animate-blob"></div><div className="absolute top-1/2 right-1/4 w-96 h-96 bg-yellow-200 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"></div><div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-yellow-500 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000"></div></div></div><div className="relative z-10 p-8"><h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">Precision. Power. Progress.</h1><p className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">Empowering Malaysian Businesses Through Solar Innovation.</p><div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"><a href="#dashboard"><Button size="lg" className="w-full sm:w-auto">Explore the Data <ArrowRight className="ml-2 h-5 w-5" /></Button></a><a href="#contact"><Button size="lg" variant="outline" className="text-white w-full sm:w-auto">Contact Us</Button></a></div></div><div className="absolute bottom-10 left-1/2 -translate-x-1/2"><ChevronDown className="w-8 h-8 text-white animate-bounce" /></div></section>);
const KPICard = ({ icon, title, value, description }) => (<Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">{title}</CardTitle>{icon}</CardHeader><CardContent><div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div><p className="text-xs text-gray-500 dark:text-gray-400">{description}</p></CardContent></Card>);
const ActiveShapePieChart = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-midAngle * (Math.PI / 180)); const cos = Math.cos(-midAngle * (Math.PI / 180));
    const sx = cx + (outerRadius + 10) * cos; const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos; const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22; const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
    return (<g><text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="font-bold text-lg">{payload.name}</text><Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} /><Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 6} outerRadius={outerRadius + 10} fill={fill} /><path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" /><circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" /><text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#fff">{`${value.toFixed(0)} kWh`}</text><text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">{`(${(percent * 100).toFixed(2)}%)`}</text></g>);
};
const LoadingSpinner = () => (<div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400"></div></div>);
const ErrorMessage = ({ message }) => (<div className="flex flex-col items-center justify-center h-full text-center text-red-500"><CloudRain className="w-16 h-16 mb-4" /><h3 className="text-xl font-semibold">Oops! Something went wrong.</h3><p className="mt-2">{message}</p></div>);

const DashboardSection = () => {
    const [model, setModel] = useState('ppa');
    const [activePieIndex, setActivePieIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [weatherForecast, setWeatherForecast] = useState(null);
    const [locationName, setLocationName] = useState('Kuala Lumpur');
    const [savingsGoal, setSavingsGoal] = useState(500);
    const savingsSliderRef = useRef(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setIsLoading(true);
                const [dashData, weatherResult] = await Promise.all([
                    getDashboardData(),
                    getWeatherForecast()
                ]);
                setDashboardData(dashData);
                setWeatherForecast(weatherResult.forecast);
                setLocationName(weatherResult.locationName);
            } catch (err) {
                console.error("Data fetching error:", err);
                setError(err.message);
                setWeatherForecast([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllData();
    }, []);

    useEffect(() => {
        if (savingsSliderRef.current) {
            const min = savingsSliderRef.current.min;
            const max = savingsSliderRef.current.max;
            const val = savingsSliderRef.current.value;
            const percentage = ((val - min) / (max - min)) * 100;
            savingsSliderRef.current.style.background = `linear-gradient(to right, #fcd913 ${percentage}%, #4a5568 ${percentage}%)`;
        }
    }, [savingsGoal]);

    const { ppaSavingsData, upfrontRoiData, pshData, allMonthlyData } = useMemo(() => {
        if (!dashboardData) return { ppaSavingsData: [], upfrontRoiData: [], pshData: [], allMonthlyData: [] };
        return { ppaSavingsData: dashboardData.charts.ppaSavings, upfrontRoiData: dashboardData.charts.upfrontRoi, pshData: dashboardData.charts.psh, allMonthlyData: dashboardData.monthlyData };
    }, [dashboardData]);
    
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [filteredPshData, setFilteredPshData] = useState(pshData);
    const [query, setQuery] = useState('');

    useEffect(() => {
        if (allMonthlyData.length > 0 && selectedYear === null) {
            setSelectedYear(allMonthlyData[0].year);
            setSelectedMonth(allMonthlyData[0].month);
        }
    }, [allMonthlyData, selectedYear]);

    const availableYears = useMemo(() => allMonthlyData.length > 0 ? [...new Set(allMonthlyData.map(d => d.year))] : [], [allMonthlyData]);
    const availableMonths = useMemo(() => allMonthlyData.length > 0 ? [...new Set(allMonthlyData.filter(d => d.year === selectedYear).map(d => d.month))].sort((a,b) => a-b) : [], [allMonthlyData, selectedYear]);

    useEffect(() => { if (availableMonths.length > 0 && !availableMonths.includes(selectedMonth)) { setSelectedMonth(availableMonths[0]); } }, [selectedYear, availableMonths, selectedMonth]);
    useEffect(() => { setFilteredPshData(pshData); }, [pshData]);

    const handleQueryChange = (e) => {
        const newQuery = e.target.value; setQuery(newQuery);
        if (!newQuery.trim()) { setFilteredPshData(pshData); return; }
        const monthWord = newQuery.toLowerCase().split(' ').find(word => monthMap[word]);
        if (monthWord) {
            const filtered = pshData.filter(d => d.month === monthMap[monthWord]);
            setFilteredPshData(filtered.length > 0 ? filtered : pshData);
        } else { setFilteredPshData(pshData); }
    };

    const selectedMonthData = useMemo(() => { if (!allMonthlyData.length > 0 || !selectedYear) return null; return allMonthlyData.find(d => d.year === selectedYear && d.month === selectedMonth); }, [allMonthlyData, selectedYear, selectedMonth]);
    const energyMixData = useMemo(() => {
        if (!selectedMonthData) return [];
        const solarEnergy = selectedMonthData.energyProduced; const gridEnergy = selectedMonthData.energyConsumed - solarEnergy;
        return [ { name: 'Solar', value: solarEnergy > 0 ? solarEnergy : 0, color: '#fcd913' }, { name: 'Grid', value: gridEnergy > 0 ? gridEnergy : 0, color: '#6b7280' }];
    }, [selectedMonthData]);
    const billComparisonData = useMemo(() => {
        if (!selectedMonthData) return [];
        return [{ name: new Date(selectedYear, selectedMonth - 1, 1).toLocaleString('default', { month: 'long' }), 'Bill Without Solar': selectedMonthData.billWithoutSolar, 'Bill With Solar': selectedMonthData.billWithSolar }];
    }, [selectedMonthData, selectedYear, selectedMonth]);
    
    const savingsChallenge = useMemo(() => {
        if(!selectedMonthData) return null;
        const actualSavings = selectedMonthData.billWithoutSolar - selectedMonthData.billWithSolar;
        const progress = Math.min((actualSavings / savingsGoal) * 100, 100);
        return { progress, achieved: progress >= 100, actualSavings };
    }, [selectedMonthData, savingsGoal]);

    const kpiData = dashboardData?.kpis;
    const activeKpi = model === 'ppa' ? kpiData?.ppa : kpiData?.upfront;
    const activeChartData = model === 'ppa' ? ppaSavingsData : upfrontRoiData;
    const activeChartKey = model === 'ppa' ? "Annual Savings (MYR)" : "Cumulative ROI (MYR)";
    const CustomTooltip = ({ active, payload, label, formatter }) => { if (active && payload && payload.length) { return (<div className="p-3 bg-gray-800/80 text-white rounded-lg border border-gray-600 backdrop-blur-sm"><p className="label font-bold">{`${label}`}</p>{payload.map((p, i) => (<p key={i} style={{ color: p.color }}>{`${p.name}: ${formatter ? formatter(p.value) : p.value.toFixed(2)}`}</p>))}</div>); } return null; };
    
    const tooltipStyle = { backgroundColor: 'rgba(31, 41, 55, 0.9)', border: '1px solid #4b5563', borderRadius: '0.5rem' };
    const tooltipLabelStyle = { color: '#fff' };

    return (
    <section id="dashboard" className="py-20 px-4 bg-gray-50 dark:bg-black"><div className="container mx-auto">
        <div className="text-center mb-12"><h2 className="text-4xl font-bold text-gray-900 dark:text-white">Solar Command Center</h2><p className="mt-4 text-lg text-gray-600 dark:text-gray-300">An advanced look into your solar potential and environmental impact.</p></div>
        {isLoading ? <div className="h-[80vh]"><LoadingSpinner /></div> : error ? <div className="h-[80vh]"><ErrorMessage message={error}/></div> : (
        <div className="transition-opacity duration-500 opacity-100">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <KPICard icon={<Zap className="w-5 h-5 text-gray-500 dark:text-gray-400"/>} title="Annual Production" value={`${(kpiData.annualEnergyProduction / 1000).toFixed(2)} MWh`} description="Projected yearly energy generation"/>
                <KPICard icon={<TrendingUp className="w-5 h-5 text-gray-500 dark:text-gray-400"/>} title="Lifetime Value" value={`RM ${Math.round(activeKpi.lifetimeSavings / 1000)}k`} description={`Based on ${model.toUpperCase()} model`}/>
                <KPICard icon={<DollarSign className="w-5 h-5 text-gray-500 dark:text-gray-400"/>} title="Est. ROI" value={model === 'ppa' ? activeKpi.roiPeriod : `${activeKpi.roiPeriod} Years`} description={`Payback period for investment`}/>
                <KPICard icon={<Leaf className="w-5 h-5 text-gray-500 dark:text-gray-400"/>} title="Trees Planted / Year" value={`${Math.round(kpiData.equivalentTrees).toLocaleString()}`} description="Equivalent environmental impact"/>
            </div>
            <Card className="mb-8">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Long-Term Financial Projections</CardTitle>
                            <CardDescription>Toggle between PPA and Upfront Purchase models.</CardDescription>
                        </div>
                        <div className="flex bg-gray-200 dark:bg-gray-800 p-1 rounded-lg">
                            <Button onClick={() => setModel('ppa')} variant={model === 'ppa' ? 'default' : 'ghost'} size="sm" className={model === 'ppa' ? 'shadow' : ''}>PPA</Button>
                            <Button onClick={() => setModel('upfront')} variant={model === 'upfront' ? 'default' : 'ghost'} size="sm" className={model === 'upfront' ? 'shadow' : ''}>Upfront</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="h-96 w-full">
                    <ResponsiveContainer>
                        <LineChart data={activeChartData} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
                            <YAxis label={{ value: 'Value (RM)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} tick={{ fill: '#9ca3af' }} tickFormatter={(value) => `${value/1000}k`} />
                            <Tooltip content={<CustomTooltip formatter={(value) => `RM ${value.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`} />} />
                            <Legend wrapperStyle={{color: "#9ca3af"}} />
                            <Line type="monotone" dataKey={activeChartKey} stroke="#fcd913" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }}/>
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>Monthly Energy Mix</CardTitle>
                                <CardDescription>Solar contribution vs. grid reliance.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Select value={selectedYear || ''} onChange={e => setSelectedYear(parseInt(e.target.value))}>{availableYears.map(year => <option key={year} value={year}>{year}</option>)}</Select>
                                <Select value={selectedMonth || ''} onChange={e => setSelectedMonth(parseInt(e.target.value))}>{availableMonths.map(month => <option key={month} value={month}>{new Date(selectedYear, month - 1, 1).toLocaleString('default', { month: 'long' })}</option>)}</Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie activeIndex={activePieIndex} activeShape={ActiveShapePieChart} data={energyMixData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" onMouseEnter={(_, index) => setActivePieIndex(index)}>
                                    {energyMixData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Bill Comparison</CardTitle>
                        <CardDescription>See your direct savings for {selectedMonthData ? new Date(selectedYear, selectedMonth - 1, 1).toLocaleString('default', { month: 'long', year: 'numeric' }) : 'the selected month'}.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={billComparisonData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                                <XAxis type="number" label={{ value: 'Bill Amount (RM)', position: 'insideBottom', offset: 0, fill: '#9ca3af' }} tick={{ fill: '#9ca3af' }} tickFormatter={(value) => `${value/1000}k`} />
                                <YAxis type="category" dataKey="name" hide />
                                <Tooltip formatter={(value) => `RM ${value.toLocaleString()}`} contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} cursor={{fill: 'rgba(107, 114, 128, 0.2)'}} />
                                <Legend wrapperStyle={{color: "#9ca3af"}} verticalAlign="bottom" />
                                <Bar dataKey="Bill Without Solar" fill="#6b7280" />
                                <Bar dataKey="Bill With Solar" fill="#fcd913" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
            <div className="text-center my-12">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Deeper Analysis</h3>
                <p className="mt-2 text-md text-gray-600 dark:text-gray-300">Explore solar resources, forecasts, and your environmental impact.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>7-Day Solar Generation Forecast</CardTitle>
                        <CardDescription>Predicted energy output based on the weather forecast for <span className="font-bold text-yellow-400">{locationName}</span>.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                        {weatherForecast && weatherForecast.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weatherForecast} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                                    <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
                                    <YAxis label={{ value: 'kWh', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} tick={{ fill: '#9ca3af' }}/>
                                    <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} cursor={{fill: 'rgba(107, 114, 128, 0.2)'}} />
                                    <Bar dataKey="Forecasted Generation (kWh)" fill="#fcd913" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">Forecast data is currently unavailable.</div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Peak Sun Hours (PSH)</CardTitle>
                        <CardDescription>Average daily hours of solar irradiance.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input id="nlp-query" type="text" value={query} onChange={handleQueryChange} placeholder='Try "Show data for May"' />
                        <div className="h-60 w-full mt-4">
                            <ResponsiveContainer>
                                <AreaChart data={filteredPshData} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <defs><linearGradient id="colorPsh" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#fcd913" stopOpacity={0.8}/><stop offset="95%" stopColor="#fcd913" stopOpacity={0}/></linearGradient></defs>
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                                    <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
                                    <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} tick={{ fill: '#9ca3af' }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="Peak Sun Hours" stroke="#fcd913" fillOpacity={1} fill="url(#colorPsh)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 mb-8">
                <Card className="flex flex-col">
                    <CardHeader className="flex flex-row items-center space-x-3">
                        <TreePine className="w-8 h-8 text-green-500" />
                        <div>
                            <CardTitle>Total Environmental Impact</CardTitle>
                            <CardDescription>20-Year CO₂ Reduction</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-grow items-center justify-center">
                        <div className="text-center">
                            <p className="text-gray-600 dark:text-gray-300">Total reduction of</p>
                            <p className="text-5xl font-bold text-green-500 my-2">{kpiData.lifetimeCO2Offset.toFixed(2)}</p>
                            <p className="text-gray-600 dark:text-gray-300">tons of CO₂ over the system's lifetime.</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Savings Goal Challenge</CardTitle>
                        <CardDescription>Set a monthly savings goal and track your progress!</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <span className="dark:text-gray-400">RM 0</span>
                            <input 
                                ref={savingsSliderRef}
                                type="range" 
                                min="100" 
                                max="1000" 
                                value={savingsGoal} 
                                onChange={(e) => setSavingsGoal(e.target.value)} 
                                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer savings-slider"
                            />
                            <span className="dark:text-gray-400">RM 1000</span>
                        </div>
                        <p className="text-center mt-2">Your Goal: <span className="font-bold text-yellow-400">RM {savingsGoal}</span></p>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 mt-4">
                            <div className="bg-yellow-400 h-6 rounded-full text-center text-black text-sm flex items-center justify-center transition-all duration-500" style={{width: `${savingsChallenge ? savingsChallenge.progress : 0}%`}}>
                                {savingsChallenge ? savingsChallenge.progress.toFixed(0) : 0}%
                            </div>
                        </div>
                        <p className="text-center mt-2 text-sm">Actual Savings for {selectedMonthData ? new Date(selectedYear, selectedMonth - 1, 1).toLocaleString('default', { month: 'long' }) : '...'}: RM {savingsChallenge ? savingsChallenge.actualSavings.toFixed(2) : '0.00'}</p>
                        {savingsChallenge?.achieved && <div className="flex items-center justify-center gap-2 mt-4 text-green-500 font-bold"><Award/> Goal Achieved!</div>}
                    </CardContent>
                </Card>
            </div>
        </div>
        )}
    </div></section>
    );
};

const ContactSection = () => {
    const form = useRef();
    const [status, setStatus] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault(); setStatus('sending');
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        try { await submitContactForm(data); setStatus('success'); form.current.reset(); } 
        catch (error) { console.error(error.message); setStatus('error'); } 
        finally { setTimeout(() => setStatus(''), 5000); }
    };
    return (<section id="contact" className="py-20 px-4 bg-gray-100 dark:bg-gray-950"><div className="container mx-auto max-w-2xl text-center"><h2 className="text-4xl font-bold text-gray-900 dark:text-white">Get In Touch</h2><p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Have a question or a project in mind? Let's talk.</p>
    <form ref={form} onSubmit={handleSubmit} className="mt-12 text-left space-y-6">
        <div><label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label><Input id="name" name="user_name" type="text" required className="mt-1" placeholder="Your Name" /></div>
        <div><label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label><Input id="email" name="user_email" type="email" required className="mt-1" placeholder="you@example.com" /></div>
        <div><label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label><textarea id="message" name="message" rows="4" required className="mt-1 flex w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 dark:focus:ring-offset-gray-950" placeholder="Your message..."></textarea></div>
        <div className="text-right"><Button type="submit" size="lg" disabled={status === 'sending'}>{status === 'sending' ? 'Sending...' : 'Send Message'}</Button></div>
        {status === 'success' && <p className="text-green-600 dark:text-green-400 text-center">Message sent successfully! We'll be in touch soon.</p>}
        {status === 'error' && <p className="text-red-600 dark:text-red-400 text-center">Something went wrong. Please try again.</p>}
    </form></div></section>);
};

const AISection = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const renderMarkdown = (text) => {
        let processedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        const lines = processedText.split('\n');
        let html = '';
        let inList = false;
        lines.forEach(line => {
            if (line.startsWith('### ')) {
                if (inList) { html += '</ul>'; inList = false; }
                html += `<h3 class="text-md font-semibold mt-2 mb-1">${line.substring(4)}</h3>`;
            } else if (line.startsWith('* ')) {
                if (!inList) { html += '<ul class="list-disc list-inside space-y-1">'; inList = true; }
                html += `<li>${line.substring(2)}</li>`;
            } else {
                if (inList) { html += '</ul>'; inList = false; }
                if (line.trim() !== '') { html += `<p class="text-sm">${line}</p>`; }
            }
        });
        if (inList) { html += '</ul>'; }
        return html;
    };

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
    useEffect(() => { if (isOpen) setMessages([{ role: 'assistant', text: "Hello! I'm Rooftop Energy's AI assistant. Ask me about our PPA or Upfront Purchase models!" }]); }, [isOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        const userMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]); setInput(''); setIsLoading(true);
        try {
            const result = await getAIChatResponse(input);
            setMessages(prev => [...prev, { role: 'assistant', text: result.response }]);
        } catch (error) {
            console.error("Error getting AI response:", error);
            setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <><div className="fixed bottom-6 right-6 z-50"><Button onClick={() => setIsOpen(!isOpen)} className="rounded-full w-16 h-16 shadow-lg">{isOpen ? <ChevronDown className="w-8 h-8 text-black" /> : <MessageSquare className="w-8 h-8 text-black" />}</Button></div>
        {isOpen && (<div className="fixed bottom-24 right-6 z-50 w-full max-w-sm"><Card className="flex flex-col h-[60vh] shadow-2xl"><CardHeader className="flex items-center space-x-3 border-b pb-4"><div className="p-2 bg-yellow-400 rounded-full"><Bot className="w-6 h-6 text-black" /></div><div><CardTitle>Rooftop Energy AI</CardTitle><CardDescription>Your personal solar assistant</CardDescription></div></CardHeader><CardContent className="flex-1 overflow-y-auto p-4 space-y-4">{messages.map((msg, index) => (<div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>{msg.role === 'assistant' && <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full"><Bot className="w-5 h-5" /></div>}<div className={`max-w-xs px-4 py-2 rounded-xl ${msg.role === 'user' ? 'bg-yellow-400 text-black' : 'bg-gray-100 dark:bg-gray-800'}`}>
            {msg.role === 'user' 
                ? <p className="text-sm">{msg.text}</p> 
                : <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }} />
            }
        </div></div>))}{isLoading && (<div className="flex items-start gap-3"><div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full"><Bot className="w-5 h-5" /></div><div className="max-w-xs px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800"><div className="flex items-center space-x-1"><span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span><span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-150"></span><span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-300"></span></div></div></div>)}<div ref={messagesEndRef} /></CardContent><form onSubmit={handleSendMessage} className="p-4 border-t"><div className="relative"><Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Compare PPA vs Upfront..." className="pr-12" disabled={isLoading} /><Button type="submit" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" disabled={isLoading}><Send className="h-4 w-4" /></Button></div></form></Card></div>)}
        </>
    );
};

const Footer = () => (<footer className="bg-black text-gray-400 py-12 px-4"><div className="container mx-auto"><div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left"><div><h4 className="font-bold text-white text-lg mb-4">Rooftop Energy</h4><p className="text-sm">Precision. Power. Progress.</p></div><div><h4 className="font-bold text-white text-lg mb-4">Contact Info</h4><ul className="space-y-2 text-sm"><li><a href="mailto:sales@rooftop.my" className="hover:text-yellow-400">Sales: sales@rooftop.my</a></li><li><a href="mailto:partnerships@rooftop.my" className="hover:text-yellow-400">Partnerships: partnerships@rooftop.my</a></li><li><a href="mailto:investors@rooftop.my" className="hover:text-yellow-400">Investors: investors@rooftop.my</a></li></ul></div><div><h4 className="font-bold text-white text-lg mb-4">Follow Us</h4><div className="flex justify-center md:justify-start space-x-4"><a href="https://www.facebook.com/people/Rooftop-Energy/61572728757164/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400"><Facebook className="w-6 h-6" /></a><a href="https://www.linkedin.com/company/rooftop-my/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400"><Linkedin className="w-6 h-6" /></a><a href="https://www.instagram.com/rooftop.my/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400"><Instagram className="w-6 h-6" /></a></div></div></div><div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm"><p>&copy; 2025 Rooftop Energy. All Rights Reserved.</p></div></div></footer>);

// --- MAIN APP COMPONENT ---
export default function App() {
    const [darkMode, setDarkMode] = useState(false);
    useEffect(() => {
        const style = document.createElement('style');  
        style.innerHTML = `
            @keyframes blob { 
                0% { transform: translate(0px, 0px) scale(1); } 
                33% { transform: translate(30px, -50px) scale(1.1); } 
                66% { transform: translate(-20px, 20px) scale(0.9); } 
                100% { transform: translate(0px, 0px) scale(1); } 
            } 
            .animation-delay-2000 { animation-delay: 2s; } 
            .animation-delay-4000 { animation-delay: 4s; } 
            html { scroll-behavior: smooth; }
            
            .savings-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 20px;
                height: 20px;
                background: #fcd913;
                cursor: pointer;
                border-radius: 50%;
                margin-top: -6px;
            }

            .savings-slider::-moz-range-thumb {
                width: 20px;
                height: 20px;
                background: #fcd913;
                cursor: pointer;
                border-radius: 50%;
            }
        `;  
        document.head.appendChild(style);  
        return () => { document.head.removeChild(style); };  
    }, []);
    
    return (<div className={darkMode ? 'dark' : ''}><div className="bg-white dark:bg-black text-gray-800 dark:text-gray-200 transition-colors duration-300"><Header darkMode={darkMode} setDarkMode={setDarkMode} /><main><HeroSection /><DashboardSection /><ContactSection /><AISection /></main><Footer /></div></div>);
}
