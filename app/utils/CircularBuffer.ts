
export class CircularBuffer<T> {
  private maxSize: number;
  private elements: (T | null)[];
	private headIndex = 0;
	private elementsCount = 0;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
    this.elements = Array(maxSize).fill(null);
  }

  getElementAt(index: number): T | null {
		return this.elements[this.getIndexOf(index)];
	}

	getSize(): number {
		return this.elementsCount;
	}

	getMaxSize(): number {
		return this.maxSize;
	}

	clear() {
		this.headIndex = 0;
		this.elementsCount = 0;
	}

  popFront(): T | null {
    const firstElement = this.elements[this.headIndex];
		this.headIndex = (this.headIndex + 1) % this.maxSize;
		this.decreaseElementsCount();
    return firstElement;
  }

  peekFront(): T | null {
    return this.elements[this.headIndex];
  }

	popBack(): T | null {
		const lastElement = this.getElementAt(this.getSize() - 1);
		this.decreaseElementsCount();
		return lastElement;
	}

  peekBack(): T | null {
    return this.getElementAt(this.getSize() - 1);
  }

	pushBack(value: T) {
		let index = this.getIndexOf(this.elementsCount);
		this.elements[index] = value;
		if (this.elementsCount == this.maxSize)
			this.headIndex = (this.headIndex + 1) % this.maxSize;
		else
			this.elementsCount++;
	}

	private decreaseElementsCount() {
		if (this.elementsCount > 0)
			this.elementsCount--;
	}

  private getIndexOf(friendlyIndex: number): number {
    return (this.headIndex + friendlyIndex) % this.maxSize;
  }
}

/*

template<typename T>
class CircularBuffer final {

public:
	T & operator[](int index) {
		return getElementAt(index);
	}

	const T & operator[](int index) const {
		return getElementAt(index);
	}

	int getSize() const {
		return elementsCount;
	}

	int getMaxSize() const {
		return maxSize;
	}

	void clear() {
		headIndex = 0;
		elementsCount = 0;
	}

	T pop() {
		auto lastElement = getLastElement();
		decreaseElementsCount();
		return lastElement;
	}

	void push_back(T value) {
		int index = (headIndex % maxSize + elementsCount % maxSize) % maxSize;
		arr[index] = value;
		if (elementsCount == maxSize)
			headIndex = headIndex == maxSize - 1 ? 0 : headIndex + 1;
		else
			elementsCount++;
	}

	std::vector<T> asVectorCopy() const {
		std::vector<T> result;
		result.reserve(getSize());
		for (int i = 0; i < elementsCount; i++)
			result.push_back(getElementAt(i));
		return result;
	}
};

*/