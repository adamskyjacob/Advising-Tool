namespace Advising_Tool.Views.Home
{
    public class Triple<T, U, V>
    {
        public T val1;
        public U val2;
        public V val3;
        public Triple(T val1, U val2, V val3)
        {
            this.val1 = val1;
            this.val2 = val2;
            this.val3 = val3;
        }
        public T GetFirst()
        {
            return val1;
        }
        public U GetSecond()
        {
            return val2;
        }
        public V GetThird()
        {
            return val3;
        }
    }
    public class TripleEnumerable<T, U, V> : List<Triple<T, U, V>>
    {
        public void Add(T val1, U val2, V val3)
        {
            Add(new Triple<T, U, V>(val1, val2, val3));
        }
        public List<T> GetFirsts()
        {
            List<T> ret = new();
            foreach (var obj in this)
            {
                ret.Add(obj.val1);
            }
            return ret;
        }
        public List<U> GetSeconds()
        {
            List<U> ret = new();
            foreach (var obj in this)
            {
                ret.Add(obj.val2);
            }
            return ret;
        }
        public List<V> GetThirds()
        {
            List<V> ret = new();
            foreach (var obj in this)
            {
                ret.Add(obj.val3);
            }
            return ret;
        }
    }
}
